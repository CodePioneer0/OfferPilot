import type { Request, Response } from "express";

import {
  createApplication,
  createApplicationEvent,
  deleteApplication,
  listApplicationEvents,
  listApplications,
  updateApplication
} from "../services/applicationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

function getUserId(req: Request): number {
  if (!req.auth) {
    throw new HttpError(401, "Unauthorized");
  }

  return req.auth.userId;
}

function parseApplicationId(value: string | undefined): number {
  if (!value) {
    throw new HttpError(400, "Invalid application id");
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, "Invalid application id");
  }

  return parsed;
}

export const listApplicationsHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const applications = await listApplications(userId);
  res.status(200).json(applications);
});

export const createApplicationHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const created = await createApplication(userId, req.body);
  res.status(201).json(created);
});

export const updateApplicationHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const applicationId = parseApplicationId(req.params.id);
  const updated = await updateApplication(userId, applicationId, req.body);
  res.status(200).json(updated);
});

export const deleteApplicationHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const applicationId = parseApplicationId(req.params.id);
  await deleteApplication(userId, applicationId);
  res.status(204).send();
});

export const createApplicationEventHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const applicationId = parseApplicationId(req.params.id);
  const createdEvent = await createApplicationEvent(userId, applicationId, req.body);
  res.status(201).json(createdEvent);
});

export const listApplicationEventsHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const applicationId = parseApplicationId(req.params.id);
  const events = await listApplicationEvents(userId, applicationId);
  res.status(200).json(events);
});
