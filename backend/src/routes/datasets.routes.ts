import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { requireRole, ROLE_ID } from "../auth/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

interface DatasetRow {
  id: string;
  dataset_name: string;
  description: string | null;
  total_images: number | null;
  created_at: string | null;
}

export const datasetsRouter = Router();

datasetsRouter.use(requireAuth);

datasetsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req);
    const [rows, totalRows] = await Promise.all([
      query<DatasetRow[]>("SELECT * FROM datasets ORDER BY created_at DESC LIMIT ? OFFSET ?", [
        limit,
        offset,
      ]),
      query<{ total: number }[]>("SELECT COUNT(*) AS total FROM datasets"),
    ]);
    res.json({ data: rows, total: totalRows[0]?.total ?? 0, limit, offset });
  })
);

datasetsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const rows = await query<DatasetRow[]>("SELECT * FROM datasets WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Dataset tidak ditemukan." });
    res.json(rows[0]);
  })
);

datasetsRouter.post(
  "/",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.RESEARCHER),
  asyncHandler(async (req, res) => {
    const { dataset_name, description, total_images } = req.body ?? {};
    if (typeof dataset_name !== "string" || !dataset_name.trim()) {
      return res.status(400).json({ error: "dataset_name wajib diisi." });
    }
    await query(
      "INSERT INTO datasets (id, dataset_name, description, total_images, created_at) VALUES (UUID(), ?, ?, ?, NOW())",
      [dataset_name, description ?? null, total_images ?? null]
    );
    const rows = await query<DatasetRow[]>("SELECT * FROM datasets WHERE dataset_name = ? LIMIT 1", [
      dataset_name,
    ]);
    res.status(201).json(rows[0]);
  })
);

datasetsRouter.put(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.RESEARCHER),
  asyncHandler(async (req, res) => {
    const { dataset_name, description, total_images } = req.body ?? {};
    await query(
      `UPDATE datasets SET
         dataset_name = COALESCE(?, dataset_name),
         description = COALESCE(?, description),
         total_images = COALESCE(?, total_images)
       WHERE id = ?`,
      [dataset_name ?? null, description ?? null, total_images ?? null, req.params.id]
    );
    const rows = await query<DatasetRow[]>("SELECT * FROM datasets WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Dataset tidak ditemukan." });
    res.json(rows[0]);
  })
);

datasetsRouter.delete(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    await query("DELETE FROM datasets WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  })
);
