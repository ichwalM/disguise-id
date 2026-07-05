import { Router } from "express";
import { query, withTransaction } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { requireRole, ROLE_ID } from "../auth/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

interface AiModelRow {
  id: string;
  version_name: string;
  architecture_type: string;
  hyperparameters: unknown;
  weights_storage_path: string | null;
  is_active: number | null;
  created_by: string | null;
  created_at: string | null;
}

export const aiModelsRouter = Router();

aiModelsRouter.use(requireAuth);

aiModelsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req);
    const [rows, totalRows] = await Promise.all([
      query<AiModelRow[]>("SELECT * FROM ai_models ORDER BY created_at DESC LIMIT ? OFFSET ?", [
        limit,
        offset,
      ]),
      query<{ total: number }[]>("SELECT COUNT(*) AS total FROM ai_models"),
    ]);
    res.json({ data: rows, total: totalRows[0]?.total ?? 0, limit, offset });
  })
);

aiModelsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const rows = await query<AiModelRow[]>("SELECT * FROM ai_models WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "AI model tidak ditemukan." });
    res.json(rows[0]);
  })
);

aiModelsRouter.post(
  "/",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.RESEARCHER),
  asyncHandler(async (req, res) => {
    const { version_name, architecture_type, hyperparameters, weights_storage_path } = req.body ?? {};
    if (typeof version_name !== "string" || typeof architecture_type !== "string") {
      return res.status(400).json({ error: "version_name dan architecture_type wajib diisi." });
    }
    await query(
      `INSERT INTO ai_models (id, version_name, architecture_type, hyperparameters, weights_storage_path, is_active, created_by, created_at)
       VALUES (UUID(), ?, ?, ?, ?, FALSE, ?, NOW())`,
      [
        version_name,
        architecture_type,
        hyperparameters ? JSON.stringify(hyperparameters) : null,
        weights_storage_path ?? null,
        req.user!.userId,
      ]
    );
    const rows = await query<AiModelRow[]>("SELECT * FROM ai_models WHERE version_name = ? LIMIT 1", [
      version_name,
    ]);
    res.status(201).json(rows[0]);
  })
);

aiModelsRouter.put(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.RESEARCHER),
  asyncHandler(async (req, res) => {
    const { version_name, architecture_type, hyperparameters, weights_storage_path } = req.body ?? {};
    await query(
      `UPDATE ai_models SET
         version_name = COALESCE(?, version_name),
         architecture_type = COALESCE(?, architecture_type),
         hyperparameters = COALESCE(?, hyperparameters),
         weights_storage_path = COALESCE(?, weights_storage_path)
       WHERE id = ?`,
      [
        version_name ?? null,
        architecture_type ?? null,
        hyperparameters ? JSON.stringify(hyperparameters) : null,
        weights_storage_path ?? null,
        req.params.id,
      ]
    );
    const rows = await query<AiModelRow[]>("SELECT * FROM ai_models WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "AI model tidak ditemukan." });
    res.json(rows[0]);
  })
);

aiModelsRouter.patch(
  "/:id/activate",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.RESEARCHER),
  asyncHandler(async (req, res) => {
    // Aktifkan target dulu; kalau tidak ada row yang match, jangan sentuh
    // model lain sama sekali (hindari men-nonaktifkan semua model karena id salah).
    const activated = await withTransaction(async (exec) => {
      const [result] = (await exec("UPDATE ai_models SET is_active = TRUE WHERE id = ?", [
        req.params.id,
      ])) as [{ affectedRows: number }, unknown];

      if (result.affectedRows === 0) return false;

      await exec("UPDATE ai_models SET is_active = FALSE WHERE id <> ?", [req.params.id]);
      return true;
    });

    if (!activated) return res.status(404).json({ error: "AI model tidak ditemukan." });

    const rows = await query<AiModelRow[]>("SELECT * FROM ai_models WHERE id = ? LIMIT 1", [req.params.id]);
    res.json(rows[0]);
  })
);

aiModelsRouter.delete(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    await query("DELETE FROM ai_models WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  })
);
