import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "./jwt.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { userId: string; roleId: number | null };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan." });
  }

  const payload = await verifyAuthToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Token tidak valid atau kedaluwarsa." });
  }

  req.user = { userId: payload.sub, roleId: payload.roleId };
  next();
}
