import request from "supertest";
import { createApp } from "../src/app";

describe("Auth - login", () => {
  it("logs in with valid credentials", async () => {

    const app = createApp();
    
    await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password123!",
      role: "student",
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "Password123!",
    });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
