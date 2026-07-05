import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db/pool.js";
import { signAuthToken } from "../auth/jwt.js";
import { requireAuth } from "../auth/middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role_id: number | null;
}

interface ProfileRow {
  full_name: string | null;
  email: string;
}

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email dan password wajib diisi." });
    }

    const rows = await query<UserRow[]>(
      "SELECT id, email, password_hash, role_id FROM mst_users WHERE email = ? LIMIT 1",
      [email]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Email atau password salah." });
    }

    const token = await signAuthToken(user.id, user.role_id);
    res.json({
      token,
      user: { id: user.id, email: user.email, roleId: user.role_id },
    });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await query<ProfileRow[]>(
      "SELECT full_name, email FROM mst_users WHERE id = ? LIMIT 1",
      [req.user!.userId]
    );
    const profile = rows[0];

    if (!profile) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    res.json({ fullName: profile.full_name, email: profile.email });
  })
);

authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (_req, res) => {
    // Stateless JWT: tidak ada state di server untuk dihapus.
    // Endpoint ini disediakan agar frontend punya alur logout yang simetris.
    res.status(200).json({ success: true });
  })
);
