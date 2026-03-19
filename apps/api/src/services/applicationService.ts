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

export async function listApplications(userId: number): Promise<Application[]> {
  return listApplicationsByUser(userId);
}

export async function createApplication(
  userId: number,
  payload: CreateApplicationPayload
): Promise<Application> {
  return createApplicationForUser(userId, payload);
}

export async function updateApplication(
  userId: number,
  applicationId: number,
  payload: UpdateApplicationPayload
): Promise<Application> {
  const updated = await updateApplicationForUser(applicationId, userId, payload);

  if (!updated) {
    throw new HttpError(404, "Application not found");
  }

  return updated;
}

export async function deleteApplication(userId: number, applicationId: number): Promise<void> {
  const deleted = await deleteApplicationForUser(applicationId, userId);

  if (!deleted) {
    throw new HttpError(404, "Application not found");
  }
}

async function assertApplicationOwnership(userId: number, applicationId: number): Promise<void> {
  const application = await getApplicationByIdForUser(applicationId, userId);

  if (!application) {
    throw new HttpError(404, "Application not found");
  }
}

export async function createApplicationEvent(
  userId: number,
  applicationId: number,
  payload: CreateInterviewEventPayload
): Promise<InterviewEvent> {
  await assertApplicationOwnership(userId, applicationId);
  return createInterviewEvent(userId, applicationId, payload);
}

export async function listApplicationEvents(
  userId: number,
  applicationId: number
): Promise<InterviewEvent[]> {
  await assertApplicationOwnership(userId, applicationId);
  return listInterviewEvents(userId, applicationId);
}
