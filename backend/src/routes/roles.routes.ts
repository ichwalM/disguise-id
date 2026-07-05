import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { requireRole, ROLE_ID } from "../auth/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

interface RoleRow {
  id: number;
  role_name: string;
  created_at: string | null;
}

export const rolesRouter = Router();

rolesRouter.use(requireAuth, requireRole(ROLE_ID.SUPER_ADMIN));

rolesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req);
    const [rows, totalRows] = await Promise.all([
      query<RoleRow[]>("SELECT * FROM mst_roles ORDER BY id LIMIT ? OFFSET ?", [limit, offset]),
      query<{ total: number }[]>("SELECT COUNT(*) AS total FROM mst_roles"),
    ]);
    res.json({ data: rows, total: totalRows[0]?.total ?? 0, limit, offset });
  })
);

rolesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const rows = await query<RoleRow[]>("SELECT * FROM mst_roles WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Role tidak ditemukan." });
    res.json(rows[0]);
  })
);

rolesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { role_name } = req.body ?? {};
    if (typeof role_name !== "string" || !role_name.trim()) {
      return res.status(400).json({ error: "role_name wajib diisi." });
    }
    const result = await query<{ insertId: number }>(
      "INSERT INTO mst_roles (role_name, created_at) VALUES (?, NOW())",
      [role_name]
    );
    const rows = await query<RoleRow[]>("SELECT * FROM mst_roles WHERE id = ? LIMIT 1", [result.insertId]);
    res.status(201).json(rows[0]);
  })
);

rolesRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { role_name } = req.body ?? {};
    await query("UPDATE mst_roles SET role_name = COALESCE(?, role_name) WHERE id = ?", [
      role_name ?? null,
      req.params.id,
    ]);
    const rows = await query<RoleRow[]>("SELECT * FROM mst_roles WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Role tidak ditemukan." });
    res.json(rows[0]);
  })
);

rolesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM mst_roles WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  })
);
