import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../auth/middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface TimelineRow {
  title: string;
  created_at: string;
}

export const dashboardRouter = Router();

dashboardRouter.get(
  "/stats",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const [usersCountRows, activities] = await Promise.all([
      query<{ total: number }[]>("SELECT COUNT(*) AS total FROM mst_users"),
      query<TimelineRow[]>(
        "SELECT title, created_at FROM mst_timelines ORDER BY created_at DESC LIMIT 5"
      ),
    ]);

    res.json({
      totalUsers: usersCountRows[0]?.total ?? 0,
      recentActivities: activities.map((a) => ({
        title: a.title,
        createdAt: a.created_at,
      })),
    });
  })
);
