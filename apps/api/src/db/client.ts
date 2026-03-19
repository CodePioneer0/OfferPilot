import type { ApplicationStage } from "@offerpilot/shared";
import { Db, MongoClient, type Collection } from "mongodb";

import { env } from "../config/env.js";

export interface UserEntity {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface ApplicationEntity {
  id: number;
  userId: number;
  company: string;
  role: string;
  location: string | null;
  jobUrl: string | null;
  stage: ApplicationStage;
  salaryMin: number | null;
  salaryMax: number | null;
  appliedOn: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewEventEntity {
  id: number;
  userId: number;
  applicationId: number;
  type: "Interview" | "Assessment" | "Follow Up";
  description: string;
  occurredOn: string;
  createdAt: string;
}

interface CounterDocument {
  _id: "users" | "applications" | "interviewEvents";
  seq: number;
}

let mongoClient: MongoClient | null = null;
let database: Db | null = null;

export async function connectDatabase(): Promise<void> {
  if (database) {
    return;
  }

  const client = new MongoClient(env.MONGO_URI);
  await client.connect();

  mongoClient = client;
  database = client.db(env.MONGO_DB_NAME);
}

function getDatabase(): Db {
  if (!database) {
    throw new Error("Database is not initialized. Call initializeDatabase() before querying.");
  }

  return database;
}

export function usersCollection(): Collection<UserEntity> {
  return getDatabase().collection<UserEntity>("users");
}

export function applicationsCollection(): Collection<ApplicationEntity> {
  return getDatabase().collection<ApplicationEntity>("applications");
}

export function interviewEventsCollection(): Collection<InterviewEventEntity> {
  return getDatabase().collection<InterviewEventEntity>("interviewEvents");
}

function countersCollection(): Collection<CounterDocument> {
  return getDatabase().collection<CounterDocument>("counters");
}

export async function ensureDatabaseIndexes(): Promise<void> {
  await usersCollection().createIndexes([
    { key: { id: 1 }, unique: true },
    { key: { email: 1 }, unique: true }
  ]);

  await applicationsCollection().createIndexes([
    { key: { id: 1 }, unique: true },
    { key: { userId: 1 } },
    { key: { userId: 1, stage: 1 } }
  ]);

  await interviewEventsCollection().createIndexes([
    { key: { id: 1 }, unique: true },
    { key: { userId: 1, applicationId: 1 } },
    { key: { userId: 1, occurredOn: 1 } }
  ]);
}

export async function getNextId(counter: CounterDocument["_id"]): Promise<number> {
  const result = await countersCollection().findOneAndUpdate(
    { _id: counter },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );

  if (!result) {
    throw new Error(`Failed to increment ${counter} counter`);
  }

  return result.seq;
}

export async function clearDatabase(): Promise<void> {
  await Promise.all([
    usersCollection().deleteMany({}),
    applicationsCollection().deleteMany({}),
    interviewEventsCollection().deleteMany({}),
    countersCollection().deleteMany({})
  ]);
}

export async function closeDatabase(): Promise<void> {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();
  mongoClient = null;
  database = null;
}
