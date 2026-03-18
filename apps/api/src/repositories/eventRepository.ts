import type { CreateInterviewEventPayload, InterviewEvent } from "@offerpilot/shared";

import { getNextId, readStore, runInStoreTransaction, type InterviewEventEntity } from "../db/client.js";

function mapEvent(eventItem: InterviewEventEntity): InterviewEvent {
  return {
    id: eventItem.id,
    applicationId: eventItem.applicationId,
    type: eventItem.type,
    description: eventItem.description,
    occurredOn: eventItem.occurredOn,
    createdAt: eventItem.createdAt
  };
}

export function createInterviewEvent(
  userId: number,
  applicationId: number,
  payload: CreateInterviewEventPayload
): InterviewEvent {
  return runInStoreTransaction((store) => {
    const now = new Date().toISOString();

    const eventItem: InterviewEventEntity = {
      id: getNextId("interviewEvents", store),
      userId,
      applicationId,
      type: payload.type,
      description: payload.description,
      occurredOn: payload.occurredOn,
      createdAt: now
    };

    store.interviewEvents.push(eventItem);

    return mapEvent(eventItem);
  });
}

export function listInterviewEvents(userId: number, applicationId: number): InterviewEvent[] {
  const store = readStore();

  return store.interviewEvents
    .filter((eventItem) => eventItem.userId === userId && eventItem.applicationId === applicationId)
    .sort((left, right) => {
      const dateDiff = Date.parse(right.occurredOn) - Date.parse(left.occurredOn);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    })
    .map(mapEvent);
}

export function countInterviewsForMonth(userId: number, monthPrefix: string): number {
  const store = readStore();

  return store.interviewEvents.filter(
    (eventItem) =>
      eventItem.userId === userId &&
      eventItem.type === "Interview" &&
      eventItem.occurredOn.startsWith(monthPrefix)
  ).length;
}
