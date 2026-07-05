import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { requireRole, ROLE_ID } from "../auth/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

interface ForensicResultRow {
  id: string;
  case_id: string | null;
  model_used: string | null;
  dataset_source: string | null;
  input_cctv_url: string;
  target_clean_url: string | null;
  output_ai_url: string | null;
  ssim_score: number | null;
  psnr_score: number | null;
  processing_time_ms: number | null;
  created_at: string | null;
}

export const forensicResultsRouter = Router();

forensicResultsRouter.use(requireAuth);

forensicResultsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req);
    const caseId = typeof req.query.caseId === "string" ? req.query.caseId : null;

    const [rows, totalRows] = await Promise.all([
      query<ForensicResultRow[]>(
        `SELECT * FROM forensic_results WHERE case_id = COALESCE(?, case_id)
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [caseId, limit, offset]
      ),
      query<{ total: number }[]>(
        "SELECT COUNT(*) AS total FROM forensic_results WHERE case_id = COALESCE(?, case_id)",
        [caseId]
      ),
    ]);
    res.json({ data: rows, total: totalRows[0]?.total ?? 0, limit, offset });
  })
);

forensicResultsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const rows = await query<ForensicResultRow[]>("SELECT * FROM forensic_results WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Hasil forensik tidak ditemukan." });
    res.json(rows[0]);
  })
);

forensicResultsRouter.post(
  "/",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.OPERATOR),
  asyncHandler(async (req, res) => {
    const {
      case_id,
      model_used,
      dataset_source,
      input_cctv_url,
      target_clean_url,
      output_ai_url,
      ssim_score,
      psnr_score,
      processing_time_ms,
    } = req.body ?? {};

    if (typeof input_cctv_url !== "string" || !input_cctv_url.trim()) {
      return res.status(400).json({ error: "input_cctv_url wajib diisi." });
    }

    await query(
      `INSERT INTO forensic_results
         (id, case_id, model_used, dataset_source, input_cctv_url, target_clean_url, output_ai_url, ssim_score, psnr_score, processing_time_ms, created_at)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        case_id ?? null,
        model_used ?? null,
        dataset_source ?? null,
        input_cctv_url,
        target_clean_url ?? null,
        output_ai_url ?? null,
        ssim_score ?? null,
        psnr_score ?? null,
        processing_time_ms ?? null,
      ]
    );
    const rows = await query<ForensicResultRow[]>(
      "SELECT * FROM forensic_results WHERE input_cctv_url = ? ORDER BY created_at DESC LIMIT 1",
      [input_cctv_url]
    );
    res.status(201).json(rows[0]);
  })
);

forensicResultsRouter.put(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN, ROLE_ID.OPERATOR),
  asyncHandler(async (req, res) => {
    const {
      case_id,
      model_used,
      dataset_source,
      input_cctv_url,
      target_clean_url,
      output_ai_url,
      ssim_score,
      psnr_score,
      processing_time_ms,
    } = req.body ?? {};

    await query(
      `UPDATE forensic_results SET
         case_id = COALESCE(?, case_id),
         model_used = COALESCE(?, model_used),
         dataset_source = COALESCE(?, dataset_source),
         input_cctv_url = COALESCE(?, input_cctv_url),
         target_clean_url = COALESCE(?, target_clean_url),
         output_ai_url = COALESCE(?, output_ai_url),
         ssim_score = COALESCE(?, ssim_score),
         psnr_score = COALESCE(?, psnr_score),
         processing_time_ms = COALESCE(?, processing_time_ms)
       WHERE id = ?`,
      [
        case_id ?? null,
        model_used ?? null,
        dataset_source ?? null,
        input_cctv_url ?? null,
        target_clean_url ?? null,
        output_ai_url ?? null,
        ssim_score ?? null,
        psnr_score ?? null,
        processing_time_ms ?? null,
        req.params.id,
      ]
    );
    const rows = await query<ForensicResultRow[]>("SELECT * FROM forensic_results WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Hasil forensik tidak ditemukan." });
    res.json(rows[0]);
  })
);

forensicResultsRouter.delete(
  "/:id",
  requireRole(ROLE_ID.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    await query("DELETE FROM forensic_results WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  })
);
