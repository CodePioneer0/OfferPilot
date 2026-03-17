import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { initializeDatabase } from "../db/init.js";
import { resetStore } from "../db/client.js";
import { createServer } from "../server.js";

const app = createServer();

beforeAll(() => {
  initializeDatabase();
});

beforeEach(() => {
  resetStore();
});

describe("OfferPilot API", () => {
  it("supports register, login, and application lifecycle", async () => {
    const registerResponse = await request(app).post("/api/v1/auth/register").send({
      name: "Test Engineer",
      email: "engineer@example.com",
      password: "StrongPass1"
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user.email).toBe("engineer@example.com");
    expect(registerResponse.body.token).toBeTypeOf("string");

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "engineer@example.com",
      password: "StrongPass1"
    });

    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.token as string;

    const createApplicationResponse = await request(app)
      .post("/api/v1/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({
        company: "OpenAI",
        role: "Full Stack Engineer",
        stage: "Applied",
        appliedOn: "2026-03-01",
        notes: "Mission-driven role"
      });

    expect(createApplicationResponse.status).toBe(201);
    expect(createApplicationResponse.body.company).toBe("OpenAI");

    const listResponse = await request(app)
      .get("/api/v1/applications")
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const summaryResponse = await request(app)
      .get("/api/v1/dashboard/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(summaryResponse.status).toBe(200);
    expect(summaryResponse.body.totalApplications).toBe(1);
    expect(summaryResponse.body.activePipeline).toBe(1);
  });

  it("returns unauthorized for protected route without token", async () => {
    const response = await request(app).get("/api/v1/applications");
    expect(response.status).toBe(401);
  });
});
