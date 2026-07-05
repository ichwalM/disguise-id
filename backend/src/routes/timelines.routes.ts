import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { requireRole, ROLE_ID } from "../auth/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

interface TimelineRow {
  id: number;
  user_id: string | null;
  title: string;
  description: string | null;
  status: string | null;
  created_at: string | null;
}

export const timelinesRouter = Router();

timelinesRouter.use(requireAuth);

timelinesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req);
    const userId = typeof req.query.userId === "string" ? req.query.userId : null;

    const [rows, totalRows] = await Promise.all([
      query<TimelineRow[]>(
        `SELECT * FROM mst_timelines WHERE user_id = COALESCE(?, user_id)
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      ),
      query<{ total: number }[]>(
        "SELECT COUNT(*) AS total FROM mst_timelines WHERE user_id = COALESCE(?, user_id)",
        [userId]
      ),
    ]);
    res.json({ data: rows, total: totalRows[0]?.total ?? 0, limit, offset });
  })
);

timelinesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const rows = await query<TimelineRow[]>("SELECT * FROM mst_timelines WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Timeline tidak ditemukan." });
    res.json(rows[0]);
  })
);

timelinesRouter.post(
  "/",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.OPERATOR),
  asyncHandler(async (req, res) => {
    const { user_id, title, description, status } = req.body ?? {};
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title wajib diisi." });
    }
    const result = await query<{ insertId: number }>(
      "INSERT INTO mst_timelines (user_id, title, description, status, created_at) VALUES (?, ?, ?, ?, NOW())",
      [user_id ?? null, title, description ?? null, status ?? null]
    );
    const rows = await query<TimelineRow[]>("SELECT * FROM mst_timelines WHERE id = ? LIMIT 1", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  })
);

timelinesRouter.put(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.OPERATOR),
  asyncHandler(async (req, res) => {
    const { user_id, title, description, status } = req.body ?? {};
    await query(
      `UPDATE mst_timelines SET
         user_id = COALESCE(?, user_id),
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         status = COALESCE(?, status)
       WHERE id = ?`,
      [user_id ?? null, title ?? null, description ?? null, status ?? null, req.params.id]
    );
    const rows = await query<TimelineRow[]>("SELECT * FROM mst_timelines WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Timeline tidak ditemukan." });
    res.json(rows[0]);
  })
);

timelinesRouter.delete(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    await query("DELETE FROM mst_timelines WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  })
);
