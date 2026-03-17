import type {
  Application,
  CreateApplicationPayload,
  CreateInterviewEventPayload,
  InterviewEvent,
  UpdateApplicationPayload
} from "@offerpilot/shared";

import {
  createApplicationForUser,
  deleteApplicationForUser,
  getApplicationByIdForUser,
  listApplicationsByUser,
  updateApplicationForUser
} from "../repositories/applicationRepository.js";
import { createInterviewEvent, listInterviewEvents } from "../repositories/eventRepository.js";
import { HttpError } from "../utils/httpError.js";

export function listApplications(userId: number): Application[] {
  return listApplicationsByUser(userId);
}

export function createApplication(userId: number, payload: CreateApplicationPayload): Application {
  return createApplicationForUser(userId, payload);
}

export function updateApplication(
  userId: number,
  applicationId: number,
  payload: UpdateApplicationPayload
): Application {
  const updated = updateApplicationForUser(applicationId, userId, payload);

  if (!updated) {
    throw new HttpError(404, "Application not found");
  }

  return updated;
}

export function deleteApplication(userId: number, applicationId: number): void {
  const deleted = deleteApplicationForUser(applicationId, userId);

  if (!deleted) {
    throw new HttpError(404, "Application not found");
  }
}

function assertApplicationOwnership(userId: number, applicationId: number): void {
  const application = getApplicationByIdForUser(applicationId, userId);

  if (!application) {
    throw new HttpError(404, "Application not found");
  }
}

export function createApplicationEvent(
  userId: number,
  applicationId: number,
  payload: CreateInterviewEventPayload
): InterviewEvent {
  assertApplicationOwnership(userId, applicationId);
  return createInterviewEvent(userId, applicationId, payload);
}

export function listApplicationEvents(userId: number, applicationId: number): InterviewEvent[] {
  assertApplicationOwnership(userId, applicationId);
  return listInterviewEvents(userId, applicationId);
}
