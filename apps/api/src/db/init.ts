import { connectDatabase, ensureDatabaseIndexes } from "./client.js";

export async function initializeDatabase(): Promise<void> {
  await connectDatabase();
  await ensureDatabaseIndexes();
}
