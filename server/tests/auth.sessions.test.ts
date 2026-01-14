import request from "supertest";
import { createApp } from "../src/app";

type Agent = ReturnType<typeof request.agent>;

describe("Auth Sessions", () => {
  const app = createApp();

  async function registerAndLogin(agent: Agent, email: string) {
    await agent.post("/api/v1/auth/register").send({
      name: "Test User",
      email,
      password: "Password123!",
      role: "student",
    });

    const res = await agent.post("/api/v1/auth/login").send({
      email,
      password: "Password123!",
    });

    expect(res.status).toBe(200);
  }

  it("lists sessions and marks current session", async () => {
    const agent = request.agent(app);
    await registerAndLogin(agent, "a@example.com");

    const res = await agent.get("/api/v1/auth/sessions");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.sessions)).toBe(true);
    expect(res.body.sessions.length).toBeGreaterThanOrEqual(1);

    const current = res.body.sessions.find((s: any) => s.isCurrent);
    expect(current).toBeTruthy();
  });

  it("revoke-others keeps current and revokes other device session", async () => {
    const agent1 = request.agent(app);
    const agent2 = request.agent(app);

    await registerAndLogin(agent1, "b@example.com");

    const res2 = await agent2.post("/api/v1/auth/login").send({
      email: "b@example.com",
      password: "Password123!",
    });
    expect(res2.status).toBe(200);

    const revokeRes = await agent1.post("/api/v1/auth/sessions/revoke-others");
    expect(revokeRes.status).toBe(200);
    expect(revokeRes.body.ok).toBe(true);

    const me1 = await agent1.get("/api/v1/auth/me");
    expect(me1.status).toBe(200);

    const refresh2 = await agent2.post("/api/v1/auth/refresh");
    expect(refresh2.status).toBe(401);
  });

  it("revoke a specific session id", async () => {
    const agent1 = request.agent(app);
    const agent2 = request.agent(app);

    await registerAndLogin(agent1, "c@example.com");
    await agent2.post("/api/v1/auth/login").send({
      email: "c@example.com",
      password: "Password123!",
    });

    const sessions = await agent1.get("/api/v1/auth/sessions");
    expect(sessions.status).toBe(200);

    const other = sessions.body.sessions.find((s: any) => !s.isCurrent);
    expect(other).toBeTruthy();

    const revoke = await agent1.post(
      `/api/v1/auth/sessions/${other.id}/revoke`
    );
    expect(revoke.status).toBe(200);

    const refresh2 = await agent2.post("/api/v1/auth/refresh");
    expect(refresh2.status).toBe(401);
  });
});
