import type { Request, Response } from "express";

import { getDashboardSummary } from "../services/dashboardService.js";
import { HttpError } from "../utils/httpError.js";

export function dashboardSummaryHandler(req: Request, res: Response): void {
  if (!req.auth) {
    throw new HttpError(401, "Unauthorized");
  }

  const summary = getDashboardSummary(req.auth.userId);
  res.status(200).json(summary);
}
