import fs from "node:fs";
import path from "node:path";

import type { ApplicationStage } from "@offerpilot/shared";

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

interface StoreCounters {
  users: number;
  applications: number;
  interviewEvents: number;
}

export interface StoreData {
  counters: StoreCounters;
  users: UserEntity[];
  applications: ApplicationEntity[];
  interviewEvents: InterviewEventEntity[];
}

const defaultStore: StoreData = {
  counters: {
    users: 0,
    applications: 0,
    interviewEvents: 0
  },
  users: [],
  applications: [],
  interviewEvents: []
};

function getStorePath(): string {
  return path.resolve(env.DB_PATH);
}

function ensureStoreDirectoryExists(): void {
  const storePath = getStorePath();
  const directoryPath = path.dirname(storePath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function writeStoreFile(data: StoreData): void {
  ensureStoreDirectoryExists();
  fs.writeFileSync(getStorePath(), JSON.stringify(data, null, 2), "utf-8");
}

function parseStore(rawData: string): StoreData {
  try {
    const parsed = JSON.parse(rawData) as StoreData;

    if (
      !parsed ||
      !parsed.counters ||
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.applications) ||
      !Array.isArray(parsed.interviewEvents)
    ) {
      return structuredClone(defaultStore);
    }

    return parsed;
  } catch {
    return structuredClone(defaultStore);
  }
}

export function initializeStore(): void {
  const storePath = getStorePath();

  if (!fs.existsSync(storePath)) {
    writeStoreFile(structuredClone(defaultStore));
    return;
  }

  const rawStore = fs.readFileSync(storePath, "utf-8");
  const parsedStore = parseStore(rawStore);
  writeStoreFile(parsedStore);
}

export function readStore(): StoreData {
  initializeStore();
  const rawStore = fs.readFileSync(getStorePath(), "utf-8");
  return parseStore(rawStore);
}

// Single-write transaction keeps data consistent for this single-process API runtime.
export function runInStoreTransaction<T>(handler: (store: StoreData) => T): T {
  const store = readStore();
  const result = handler(store);
  writeStoreFile(store);
  return result;
}

export function resetStore(): void {
  writeStoreFile(structuredClone(defaultStore));
}

export function getNextId(counter: keyof StoreCounters, store: StoreData): number {
  store.counters[counter] += 1;
  return store.counters[counter];
}
