import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { requireRole, ROLE_ID } from "../auth/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

interface ForensicCaseRow {
  id: string;
  case_number: string;
  investigator_id: string | null;
  notes: string | null;
  status: string | null;
  created_at: string | null;
}

export const forensicCasesRouter = Router();

forensicCasesRouter.use(requireAuth);

forensicCasesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req);
    const status = typeof req.query.status === "string" ? req.query.status : null;

    const [rows, totalRows] = await Promise.all([
      query<ForensicCaseRow[]>(
        `SELECT * FROM forensic_cases WHERE status = COALESCE(?, status)
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [status, limit, offset]
      ),
      query<{ total: number }[]>(
        "SELECT COUNT(*) AS total FROM forensic_cases WHERE status = COALESCE(?, status)",
        [status]
      ),
    ]);
    res.json({ data: rows, total: totalRows[0]?.total ?? 0, limit, offset });
  })
);

forensicCasesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const rows = await query<ForensicCaseRow[]>("SELECT * FROM forensic_cases WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Kasus forensik tidak ditemukan." });
    res.json(rows[0]);
  })
);

forensicCasesRouter.post(
  "/",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.OPERATOR),
  asyncHandler(async (req, res) => {
    const { case_number, investigator_id, notes, status } = req.body ?? {};
    if (typeof case_number !== "string" || !case_number.trim()) {
      return res.status(400).json({ error: "case_number wajib diisi." });
    }
    await query(
      `INSERT INTO forensic_cases (id, case_number, investigator_id, notes, status, created_at)
       VALUES (UUID(), ?, ?, ?, ?, NOW())`,
      [case_number, investigator_id ?? null, notes ?? null, status ?? null]
    );
    const rows = await query<ForensicCaseRow[]>("SELECT * FROM forensic_cases WHERE case_number = ? LIMIT 1", [
      case_number,
    ]);
    res.status(201).json(rows[0]);
  })
);

forensicCasesRouter.put(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.OPERATOR),
  asyncHandler(async (req, res) => {
    const { case_number, investigator_id, notes, status } = req.body ?? {};
    await query(
      `UPDATE forensic_cases SET
         case_number = COALESCE(?, case_number),
         investigator_id = COALESCE(?, investigator_id),
         notes = COALESCE(?, notes),
         status = COALESCE(?, status)
       WHERE id = ?`,
      [case_number ?? null, investigator_id ?? null, notes ?? null, status ?? null, req.params.id]
    );
    const rows = await query<ForensicCaseRow[]>("SELECT * FROM forensic_cases WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Kasus forensik tidak ditemukan." });
    res.json(rows[0]);
  })
);

forensicCasesRouter.delete(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    await query("DELETE FROM forensic_cases WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  })
);
