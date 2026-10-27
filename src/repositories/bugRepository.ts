import sqlite3 = require("sqlite3");
import databaseModule = require("../db/database");
import type {
  Bug,
  BugPriority,
  BugStatus,
  UpdateBugInput,
} from "../models/bug";

const { database } = databaseModule;

function projectExists(projectId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    database.get<{ id: number }>(
      "SELECT id FROM projects WHERE id = ?",
      [projectId],
      (error, project) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(project !== undefined);
      },
    );
  });
}

function createBug(
  projectId: number,
  title: string,
  description: string | null,
  priority: BugPriority,
  status: BugStatus,
): Promise<Bug> {
  return new Promise((resolve, reject) => {
    database.run(
      `INSERT INTO bugs (project_id, title, description, priority, status)
       VALUES (?, ?, ?, ?, ?)`,
      [projectId, title, description, priority, status],
      function (this: sqlite3.RunResult, error: Error | null) {
        if (error) {
          reject(error);
          return;
        }

        database.get<Bug>(
          `SELECT id,
                  project_id AS projectId,
                  title,
                  description,
                  priority,
                  status,
                  strftime('%Y-%m-%dT%H:%M:%fZ', created_at) AS createdAt,
                  strftime('%Y-%m-%dT%H:%M:%fZ', updated_at) AS updatedAt
           FROM bugs
           WHERE id = ?`,
          [this.lastID],
          (selectError, bug) => {
            if (selectError) {
              reject(selectError);
              return;
            }

            if (!bug) {
              reject(new Error("The bug could not be retrieved after creation."));
              return;
            }

            resolve(bug);
          },
        );
      },
    );
  });
}

function listBugs(projectId: number): Promise<Bug[]> {
  return new Promise((resolve, reject) => {
    database.all<Bug>(
      `SELECT id,
              project_id AS projectId,
              title,
              description,
              priority,
              status,
              strftime('%Y-%m-%dT%H:%M:%fZ', created_at) AS createdAt,
              strftime('%Y-%m-%dT%H:%M:%fZ', updated_at) AS updatedAt
       FROM bugs
       WHERE project_id = ?
       ORDER BY id ASC`,
      [projectId],
      (error, bugs) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(bugs);
      },
    );
  });
}

function getBug(bugId: number): Promise<Bug | null> {
  return new Promise((resolve, reject) => {
    database.get<Bug>(
      `SELECT id,
              project_id AS projectId,
              title,
              description,
              priority,
              status,
              strftime('%Y-%m-%dT%H:%M:%fZ', created_at) AS createdAt,
              strftime('%Y-%m-%dT%H:%M:%fZ', updated_at) AS updatedAt
       FROM bugs
       WHERE id = ?`,
      [bugId],
      (error, bug) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(bug ?? null);
      },
    );
  });
}

async function updateBug(
  bugId: number,
  updates: UpdateBugInput,
): Promise<Bug | null> {
  const fields: string[] = [];
  const parameters: unknown[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    parameters.push(updates.title);
  }

  if (updates.description !== undefined) {
    fields.push("description = ?");
    parameters.push(updates.description);
  }

  if (updates.priority !== undefined) {
    fields.push("priority = ?");
    parameters.push(updates.priority);
  }

  if (updates.status !== undefined) {
    fields.push("status = ?");
    parameters.push(updates.status);
  }

  if (fields.length === 0) {
    return getBug(bugId);
  }

  parameters.push(bugId);

  await new Promise<void>((resolve, reject) => {
    database.run(
      `UPDATE bugs SET ${fields.join(", ")} WHERE id = ?`,
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

  return getBug(bugId);
}

function deleteBug(bugId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    database.run(
      "DELETE FROM bugs WHERE id = ?",
      [bugId],
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
  projectExists,
  createBug,
  listBugs,
  getBug,
  updateBug,
  deleteBug,
};
