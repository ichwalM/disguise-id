import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { rolesRouter } from "./routes/roles.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { timelinesRouter } from "./routes/timelines.routes.js";
import { datasetsRouter } from "./routes/datasets.routes.js";
import { aiModelsRouter } from "./routes/ai-models.routes.js";
import { aiTrainingLogsRouter } from "./routes/ai-training-logs.routes.js";
import { forensicCasesRouter } from "./routes/forensic-cases.routes.js";
import { forensicResultsRouter } from "./routes/forensic-results.routes.js";

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/users", usersRouter);
app.use("/api/timelines", timelinesRouter);
app.use("/api/datasets", datasetsRouter);
app.use("/api/ai-models", aiModelsRouter);
app.use("/api/ai-training-logs", aiTrainingLogsRouter);
app.use("/api/forensic-cases", forensicCasesRouter);
app.use("/api/forensic-results", forensicResultsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

interface MysqlError {
  code?: string;
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const mysqlCode = (err as MysqlError)?.code;

  if (mysqlCode === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Data sudah ada / duplikat." });
  }
  if (mysqlCode === "ER_NO_REFERENCED_ROW_2" || mysqlCode === "ER_NO_REFERENCED_ROW") {
    return res.status(400).json({ error: "ID referensi tidak valid." });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
