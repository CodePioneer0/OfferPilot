import { Router } from "express";

import { dashboardSummaryHandler } from "../controllers/dashboardController.js";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", dashboardSummaryHandler);
