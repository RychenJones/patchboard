import request = require("supertest");
import app = require("../src/app");
import databaseModule = require("../src/db/database");
import migrations = require("../src/db/migrations");

const { execute } = databaseModule;

describe("project routes", () => {
  beforeAll(async () => {
    await migrations.runMigrations();
  });

  beforeEach(async () => {
    await execute("DELETE FROM bugs");
    await execute("DELETE FROM projects");
  });

  it("creates a project", async () => {
    const response = await request(app)
      .post("/api/projects")
      .send({ name: "PatchBoard" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({ name: "PatchBoard" }),
    );
    expect(response.body.id).toEqual(expect.any(Number));
  });

  it("rejects a project with a blank name", async () => {
    const response = await request(app)
      .post("/api/projects")
      .send({ name: "   " });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Project name is required." });
  });
});
