import type { Request, Response } from "express";

import { getDashboardSummary } from "../services/dashboardService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const dashboardSummaryHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Unauthorized");
  }

  const summary = await getDashboardSummary(req.auth.userId);
  res.status(200).json(summary);
});
