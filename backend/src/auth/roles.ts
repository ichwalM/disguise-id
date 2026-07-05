import type { NextFunction, Request, Response } from "express";

// Sesuai dengan baris yang di-seed di migrations/mysql/002_seed_admin.sql.
// Dipakai berdasarkan id (bukan role_name) karena id stabil, sedangkan
// nama role bisa berubah lewat /api/roles.
export const ROLE_ID = {
  SUPER_ADMIN: 1,
  OPERATOR: 2,
  RESEARCHER: 3,
} as const;

export function requireRole(...allowed: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowed.includes(req.user.roleId ?? -1)) {
      return res.status(403).json({ error: "Anda tidak punya akses untuk aksi ini." });
    }
    next();
  };
}
