import type {
  Application,
  ApplicationStage,
  CreateApplicationPayload,
  UpdateApplicationPayload
} from "@offerpilot/shared";

import { applicationsCollection, getNextId, interviewEventsCollection, type ApplicationEntity } from "../db/client.js";

function mapApplication(application: ApplicationEntity): Application {
  return {
    id: application.id,
    company: application.company,
    role: application.role,
    location: application.location,
    jobUrl: application.jobUrl,
    stage: application.stage,
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    appliedOn: application.appliedOn,
    notes: application.notes,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt
  };
}

export async function listApplicationsByUser(userId: number): Promise<Application[]> {
  const applications = await applicationsCollection()
    .find({ userId })
    .sort({ appliedOn: -1, createdAt: -1 })
    .toArray();

  return applications.map(mapApplication);
}

export async function getApplicationByIdForUser(
  applicationId: number,
  userId: number
): Promise<Application | null> {
  const application = await applicationsCollection().findOne({ id: applicationId, userId });

  return application ? mapApplication(application) : null;
}

export async function createApplicationForUser(
  userId: number,
  payload: CreateApplicationPayload
): Promise<Application> {
  const now = new Date().toISOString();

  const application: ApplicationEntity = {
    id: await getNextId("applications"),
    userId,
    company: payload.company,
    role: payload.role,
    location: payload.location ?? null,
    jobUrl: payload.jobUrl ?? null,
    stage: payload.stage,
    salaryMin: payload.salaryMin ?? null,
    salaryMax: payload.salaryMax ?? null,
    appliedOn: payload.appliedOn,
    notes: payload.notes ?? null,
    createdAt: now,
    updatedAt: now
  };

  await applicationsCollection().insertOne(application);
  return mapApplication(application);
}

export async function updateApplicationForUser(
  applicationId: number,
  userId: number,
  payload: UpdateApplicationPayload
): Promise<Application | null> {
  const updates: Partial<ApplicationEntity> = {
    updatedAt: new Date().toISOString()
  };

  if (payload.company !== undefined) {
    updates.company = payload.company;
  }

  if (payload.role !== undefined) {
    updates.role = payload.role;
  }

  if (payload.location !== undefined) {
    updates.location = payload.location;
  }

  if (payload.jobUrl !== undefined) {
    updates.jobUrl = payload.jobUrl;
  }

  if (payload.stage !== undefined) {
    updates.stage = payload.stage;
  }

  if (payload.salaryMin !== undefined) {
    updates.salaryMin = payload.salaryMin;
  }

  if (payload.salaryMax !== undefined) {
    updates.salaryMax = payload.salaryMax;
  }

  if (payload.appliedOn !== undefined) {
    updates.appliedOn = payload.appliedOn;
  }

  if (payload.notes !== undefined) {
    updates.notes = payload.notes;
  }

  const updated = await applicationsCollection().findOneAndUpdate(
    { id: applicationId, userId },
    { $set: updates },
    { returnDocument: "after" }
  );

  return updated ? mapApplication(updated) : null;
}

export async function deleteApplicationForUser(applicationId: number, userId: number): Promise<boolean> {
  const deleteResult = await applicationsCollection().deleteOne({ id: applicationId, userId });

  if (deleteResult.deletedCount === 0) {
    return false;
  }

  await interviewEventsCollection().deleteMany({ applicationId, userId });
  return true;
}

export async function countApplicationsForUser(userId: number): Promise<number> {
  return applicationsCollection().countDocuments({ userId });
}

export async function countApplicationsByStages(userId: number, stages: ApplicationStage[]): Promise<number> {
  if (stages.length === 0) {
    return 0;
  }

  return applicationsCollection().countDocuments({ userId, stage: { $in: stages } });
}

export async function getStageBreakdown(
  userId: number
): Promise<Array<{ stage: ApplicationStage; count: number }>> {
  const rows = await applicationsCollection()
    .aggregate<{ _id: ApplicationStage; count: number }>([
      { $match: { userId } },
      { $group: { _id: "$stage", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    .toArray();

  return rows.map((row) => ({ stage: row._id, count: row.count }));
}
