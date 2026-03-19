import { afterAll } from "vitest";

import { MongoMemoryServer } from "mongodb-memory-server";

process.env.NODE_ENV = "test";
process.env.PORT = "4001";
process.env.JWT_SECRET = "integration-test-secret-123";
const mongoServer = await MongoMemoryServer.create();

process.env.MONGO_URI = mongoServer.getUri();
process.env.MONGO_DB_NAME = "offerpilot_test";
process.env.CLIENT_ORIGIN = "http://localhost:5173";

afterAll(async () => {
  await mongoServer.stop();
});
