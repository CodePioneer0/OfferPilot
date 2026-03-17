import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { applicationRouter } from "./routes/applicationRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { dashboardRouter } from "./routes/dashboardRoutes.js";

export function createServer(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/applications", requireAuth, applicationRouter);
  app.use("/api/v1/dashboard", requireAuth, dashboardRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
