import type {
  Application,
  ApplicationStage,
  CreateApplicationPayload,
  UpdateApplicationPayload
} from "@offerpilot/shared";

import { getNextId, readStore, runInStoreTransaction, type ApplicationEntity } from "../db/client.js";

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

function sortByAppliedDate(applications: ApplicationEntity[]): ApplicationEntity[] {
  return applications.sort((left, right) => {
    const appliedDiff = Date.parse(right.appliedOn) - Date.parse(left.appliedOn);

    if (appliedDiff !== 0) {
      return appliedDiff;
    }

    return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  });
}

export function listApplicationsByUser(userId: number): Application[] {
  const store = readStore();
  const ownedApplications = store.applications.filter((application) => application.userId === userId);

  return sortByAppliedDate(ownedApplications).map(mapApplication);
}

export function getApplicationByIdForUser(applicationId: number, userId: number): Application | null {
  const store = readStore();
  const application = store.applications.find(
    (candidate) => candidate.id === applicationId && candidate.userId === userId
  );

  return application ? mapApplication(application) : null;
}

export function createApplicationForUser(userId: number, payload: CreateApplicationPayload): Application {
  return runInStoreTransaction((store) => {
    const now = new Date().toISOString();

    const application: ApplicationEntity = {
      id: getNextId("applications", store),
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

    store.applications.push(application);

    return mapApplication(application);
  });
}

export function updateApplicationForUser(
  applicationId: number,
  userId: number,
  payload: UpdateApplicationPayload
): Application | null {
  return runInStoreTransaction((store) => {
    const application = store.applications.find(
      (candidate) => candidate.id === applicationId && candidate.userId === userId
    );

    if (!application) {
      return null;
    }

    if (payload.company !== undefined) {
      application.company = payload.company;
    }

    if (payload.role !== undefined) {
      application.role = payload.role;
    }

    if (payload.location !== undefined) {
      application.location = payload.location;
    }

    if (payload.jobUrl !== undefined) {
      application.jobUrl = payload.jobUrl;
    }

    if (payload.stage !== undefined) {
      application.stage = payload.stage;
    }

    if (payload.salaryMin !== undefined) {
      application.salaryMin = payload.salaryMin;
    }

    if (payload.salaryMax !== undefined) {
      application.salaryMax = payload.salaryMax;
    }

    if (payload.appliedOn !== undefined) {
      application.appliedOn = payload.appliedOn;
    }

    if (payload.notes !== undefined) {
      application.notes = payload.notes;
    }

    application.updatedAt = new Date().toISOString();

    return mapApplication(application);
  });
}

export function deleteApplicationForUser(applicationId: number, userId: number): boolean {
  return runInStoreTransaction((store) => {
    const beforeCount = store.applications.length;

    store.applications = store.applications.filter(
      (application) => !(application.id === applicationId && application.userId === userId)
    );

    if (store.applications.length === beforeCount) {
      return false;
    }

    store.interviewEvents = store.interviewEvents.filter((eventItem) => eventItem.applicationId !== applicationId);
    return true;
  });
}

export function countApplicationsForUser(userId: number): number {
  const store = readStore();
  return store.applications.filter((application) => application.userId === userId).length;
}

export function countApplicationsByStages(userId: number, stages: ApplicationStage[]): number {
  if (stages.length === 0) {
    return 0;
  }

  const store = readStore();
  const stageSet = new Set(stages);

  return store.applications.filter(
    (application) => application.userId === userId && stageSet.has(application.stage)
  ).length;
}

export function getStageBreakdown(userId: number): Array<{ stage: ApplicationStage; count: number }> {
  const store = readStore();
  const counts = new Map<ApplicationStage, number>();

  store.applications.forEach((application) => {
    if (application.userId !== userId) {
      return;
    }

    const current = counts.get(application.stage) ?? 0;
    counts.set(application.stage, current + 1);
  });

  return Array.from(counts.entries())
    .map(([stage, count]) => ({ stage, count }))
    .sort((left, right) => right.count - left.count);
}
