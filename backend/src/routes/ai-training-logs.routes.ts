import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { requireRole, ROLE_ID } from "../auth/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

interface TrainingLogRow {
  id: number;
  model_id: string | null;
  epoch_number: number;
  generator_loss: number | null;
  discriminator_loss: number | null;
  duration_seconds: number | null;
  created_at: string | null;
}

export const aiTrainingLogsRouter = Router();

aiTrainingLogsRouter.use(requireAuth);

aiTrainingLogsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req);
    const modelId = typeof req.query.modelId === "string" ? req.query.modelId : null;

    const [rows, totalRows] = await Promise.all([
      query<TrainingLogRow[]>(
        `SELECT * FROM ai_training_logs WHERE model_id = COALESCE(?, model_id)
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [modelId, limit, offset]
      ),
      query<{ total: number }[]>(
        "SELECT COUNT(*) AS total FROM ai_training_logs WHERE model_id = COALESCE(?, model_id)",
        [modelId]
      ),
    ]);
    res.json({ data: rows, total: totalRows[0]?.total ?? 0, limit, offset });
  })
);

aiTrainingLogsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const rows = await query<TrainingLogRow[]>("SELECT * FROM ai_training_logs WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Training log tidak ditemukan." });
    res.json(rows[0]);
  })
);

aiTrainingLogsRouter.post(
  "/",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.RESEARCHER),
  asyncHandler(async (req, res) => {
    const { model_id, epoch_number, generator_loss, discriminator_loss, duration_seconds } = req.body ?? {};
    if (typeof epoch_number !== "number") {
      return res.status(400).json({ error: "epoch_number wajib diisi (number)." });
    }
    const result = await query<{ insertId: number }>(
      `INSERT INTO ai_training_logs (model_id, epoch_number, generator_loss, discriminator_loss, duration_seconds, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [model_id ?? null, epoch_number, generator_loss ?? null, discriminator_loss ?? null, duration_seconds ?? null]
    );
    const rows = await query<TrainingLogRow[]>("SELECT * FROM ai_training_logs WHERE id = ? LIMIT 1", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  })
);

aiTrainingLogsRouter.put(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.RESEARCHER),
  asyncHandler(async (req, res) => {
    const { model_id, epoch_number, generator_loss, discriminator_loss, duration_seconds } = req.body ?? {};
    await query(
      `UPDATE ai_training_logs SET
         model_id = COALESCE(?, model_id),
         epoch_number = COALESCE(?, epoch_number),
         generator_loss = COALESCE(?, generator_loss),
         discriminator_loss = COALESCE(?, discriminator_loss),
         duration_seconds = COALESCE(?, duration_seconds)
       WHERE id = ?`,
      [
        model_id ?? null,
        epoch_number ?? null,
        generator_loss ?? null,
        discriminator_loss ?? null,
        duration_seconds ?? null,
        req.params.id,
      ]
    );
    const rows = await query<TrainingLogRow[]>("SELECT * FROM ai_training_logs WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Training log tidak ditemukan." });
    res.json(rows[0]);
  })
);

aiTrainingLogsRouter.delete(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    await query("DELETE FROM ai_training_logs WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  })
);
