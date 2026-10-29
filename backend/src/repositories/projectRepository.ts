import sqlite3 = require("sqlite3");
import databaseModule = require("../db/database");
import type { Project, UpdateProjectInput } from "../models/project";

const { database } = databaseModule;

const projectSelect = `
  SELECT id,
         name,
         strftime('%Y-%m-%dT%H:%M:%fZ', created_at) AS createdAt
  FROM projects`;

function createProject(name: string): Promise<Project> {
  return new Promise((resolve, reject) => {
    database.run(
      "INSERT INTO projects (name) VALUES (?)",
      [name],
      function (this: sqlite3.RunResult, error: Error | null) {
        if (error) {
          reject(error);
          return;
        }

        database.get<Project>(
          `${projectSelect}
           WHERE id = ?`,
          [this.lastID],
          (selectError, project) => {
            if (selectError) {
              reject(selectError);
              return;
            }

            if (!project) {
              reject(new Error("The project could not be retrieved after creation."));
              return;
            }

            resolve(project);
          },
        );
      },
    );
  });
}

function listProjects(): Promise<Project[]> {
  return new Promise((resolve, reject) => {
    database.all<Project>(
      `${projectSelect}
       ORDER BY id ASC`,
      (error, projects) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(projects);
      },
    );
  });
}

function getProject(projectId: number): Promise<Project | null> {
  return new Promise((resolve, reject) => {
    database.get<Project>(
      `${projectSelect}
       WHERE id = ?`,
      [projectId],
      (error, project) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(project ?? null);
      },
    );
  });
}

async function updateProject(
  projectId: number,
  updates: UpdateProjectInput,
): Promise<Project | null> {
  const fields: string[] = [];
  const parameters: unknown[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    parameters.push(updates.name);
  }

  if (fields.length === 0) {
    return getProject(projectId);
  }

  parameters.push(projectId);
  await new Promise<void>((resolve, reject) => {
    database.run(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = ?`,
      parameters,
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      },
    );
  });

  return getProject(projectId);
}

function deleteProject(projectId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    database.run(
      "DELETE FROM projects WHERE id = ?",
      [projectId],
      function (this: sqlite3.RunResult, error: Error | null) {
        if (error) {
          reject(error);
          return;
        }

        resolve(this.changes > 0);
      },
    );
  });
}

export = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
};
