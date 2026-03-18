import { Router } from "express";

import {
  createApplicationEventHandler,
  createApplicationHandler,
  deleteApplicationHandler,
  listApplicationEventsHandler,
  listApplicationsHandler,
  updateApplicationHandler
} from "../controllers/applicationController.js";
import { validateBody } from "../middleware/validate.js";
import { createApplicationSchema, updateApplicationSchema } from "../schemas/applicationSchemas.js";
import { createEventSchema } from "../schemas/eventSchemas.js";

export const applicationRouter = Router();

applicationRouter.get("/", listApplicationsHandler);
applicationRouter.post("/", validateBody(createApplicationSchema), createApplicationHandler);
applicationRouter.patch("/:id", validateBody(updateApplicationSchema), updateApplicationHandler);
applicationRouter.delete("/:id", deleteApplicationHandler);
applicationRouter.get("/:id/events", listApplicationEventsHandler);
applicationRouter.post("/:id/events", validateBody(createEventSchema), createApplicationEventHandler);
