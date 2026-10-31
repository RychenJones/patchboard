import request = require("supertest");
import app = require("../src/app");
import databaseModule = require("../src/db/database");
import migrations = require("../src/db/migrations");

const { execute } = databaseModule;

describe("bug routes", () => {
  beforeAll(async () => {
    await migrations.runMigrations();
  });

  beforeEach(async () => {
    await execute("DELETE FROM bugs");
    await execute("DELETE FROM projects");
  });

  async function createProject(): Promise<number> {
    const response = await request(app)
      .post("/api/projects")
      .send({ name: "PatchBoard" });
    return response.body.id as number;
  }

  it("creates a bug with validated defaults and supplied fields", async () => {
    const projectId = await createProject();
    const response = await request(app)
      .post(`/api/projects/${projectId}/bugs`)
      .send({
        title: "Fix the dashboard",
        description: "The totals are stale.",
        priority: "high",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        projectId,
        title: "Fix the dashboard",
        description: "The totals are stale.",
        priority: "high",
        status: "incomplete",
      }),
    );
  });

  it("rejects a bug with a blank title or invalid status", async () => {
    const projectId = await createProject();
    const blankTitleResponse = await request(app)
      .post(`/api/projects/${projectId}/bugs`)
      .send({ title: "  " });
    const invalidStatusResponse = await request(app)
      .post(`/api/projects/${projectId}/bugs`)
      .send({ title: "Valid title", status: "closed" });

    expect(blankTitleResponse.status).toBe(400);
    expect(blankTitleResponse.body).toEqual({ error: "Bug title is required." });
    expect(invalidStatusResponse.status).toBe(400);
    expect(invalidStatusResponse.body).toEqual({
      error: "Bug status must be incomplete, in-progress, or completed.",
    });
  });

  it("updates a bug status", async () => {
    const projectId = await createProject();
    const createResponse = await request(app)
      .post(`/api/projects/${projectId}/bugs`)
      .send({ title: "Fix the dashboard" });

    const updateResponse = await request(app)
      .patch(`/api/bugs/${createResponse.body.id}`)
      .send({ status: "in-progress" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        id: createResponse.body.id,
        status: "in-progress",
      }),
    );
  });
});
