import type { Request, Response } from "express";

import {
  createApplication,
  createApplicationEvent,
  deleteApplication,
  listApplicationEvents,
  listApplications,
  updateApplication
} from "../services/applicationService.js";
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

export function listApplicationsHandler(req: Request, res: Response): void {
  const userId = getUserId(req);
  const applications = listApplications(userId);
  res.status(200).json(applications);
}

export function createApplicationHandler(req: Request, res: Response): void {
  const userId = getUserId(req);
  const created = createApplication(userId, req.body);
  res.status(201).json(created);
}

export function updateApplicationHandler(req: Request, res: Response): void {
  const userId = getUserId(req);
  const applicationId = parseApplicationId(req.params.id);
  const updated = updateApplication(userId, applicationId, req.body);
  res.status(200).json(updated);
}

export function deleteApplicationHandler(req: Request, res: Response): void {
  const userId = getUserId(req);
  const applicationId = parseApplicationId(req.params.id);
  deleteApplication(userId, applicationId);
  res.status(204).send();
}

export function createApplicationEventHandler(req: Request, res: Response): void {
  const userId = getUserId(req);
  const applicationId = parseApplicationId(req.params.id);
  const createdEvent = createApplicationEvent(userId, applicationId, req.body);
  res.status(201).json(createdEvent);
}

export function listApplicationEventsHandler(req: Request, res: Response): void {
  const userId = getUserId(req);
  const applicationId = parseApplicationId(req.params.id);
  const events = listApplicationEvents(userId, applicationId);
  res.status(200).json(events);
}
