import type { CreateInterviewEventPayload, InterviewEvent } from "@offerpilot/shared";

import { getNextId, interviewEventsCollection, type InterviewEventEntity } from "../db/client.js";

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

export async function createInterviewEvent(
  userId: number,
  applicationId: number,
  payload: CreateInterviewEventPayload
): Promise<InterviewEvent> {
  const now = new Date().toISOString();

  const eventItem: InterviewEventEntity = {
    id: await getNextId("interviewEvents"),
    userId,
    applicationId,
    type: payload.type,
    description: payload.description,
    occurredOn: payload.occurredOn,
    createdAt: now
  };

  await interviewEventsCollection().insertOne(eventItem);
  return mapEvent(eventItem);
}

export async function listInterviewEvents(userId: number, applicationId: number): Promise<InterviewEvent[]> {
  const events = await interviewEventsCollection()
    .find({ userId, applicationId })
    .sort({ occurredOn: -1, createdAt: -1 })
    .toArray();

  return events.map(mapEvent);
}

export async function countInterviewsForMonth(userId: number, monthPrefix: string): Promise<number> {
  return interviewEventsCollection().countDocuments({
    userId,
    type: "Interview",
    occurredOn: { $regex: `^${monthPrefix}` }
  });
}
