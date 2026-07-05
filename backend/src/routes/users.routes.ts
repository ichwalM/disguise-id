import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { requireRole, ROLE_ID } from "../auth/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  role_id: number | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const SAFE_COLUMNS = "id, email, full_name, role_id, avatar_url, created_at, updated_at";

export const usersRouter = Router();

usersRouter.use(requireAuth, requireRole(ROLE_ID.SUPER_ADMIN));

usersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req);
    const [rows, totalRows] = await Promise.all([
      query<UserRow[]>(
        `SELECT ${SAFE_COLUMNS} FROM mst_users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      ),
      query<{ total: number }[]>("SELECT COUNT(*) AS total FROM mst_users"),
    ]);
    res.json({ data: rows, total: totalRows[0]?.total ?? 0, limit, offset });
  })
);

usersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const rows = await query<UserRow[]>(`SELECT ${SAFE_COLUMNS} FROM mst_users WHERE id = ? LIMIT 1`, [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "User tidak ditemukan." });
    res.json(rows[0]);
  })
);

usersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email, password, full_name, role_id, avatar_url } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "email dan password wajib diisi." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query<{ insertId: number }>(
      `INSERT INTO mst_users (id, email, password_hash, full_name, role_id, avatar_url, created_at, updated_at)
       VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`,
      [email, passwordHash, full_name ?? null, role_id ?? null, avatar_url ?? null]
    );

    const rows = await query<UserRow[]>(`SELECT ${SAFE_COLUMNS} FROM mst_users WHERE email = ? LIMIT 1`, [
      email,
    ]);
    void result;
    res.status(201).json(rows[0]);
  })
);

usersRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { email, password, full_name, role_id, avatar_url } = req.body ?? {};
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    await query(
      `UPDATE mst_users SET
         email = COALESCE(?, email),
         password_hash = COALESCE(?, password_hash),
         full_name = COALESCE(?, full_name),
         role_id = COALESCE(?, role_id),
         avatar_url = COALESCE(?, avatar_url),
         updated_at = NOW()
       WHERE id = ?`,
      [email ?? null, passwordHash, full_name ?? null, role_id ?? null, avatar_url ?? null, req.params.id]
    );

    const rows = await query<UserRow[]>(`SELECT ${SAFE_COLUMNS} FROM mst_users WHERE id = ? LIMIT 1`, [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "User tidak ditemukan." });
    res.json(rows[0]);
  })
);

usersRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM mst_users WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  })
);
