import sqlite3 = require("sqlite3");
import databaseModule = require("../db/database");
import type { Project } from "../models/project";

const { database } = databaseModule;

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
          `SELECT id, name, created_at AS createdAt
           FROM projects
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
      `SELECT id, name, created_at AS createdAt
       FROM projects
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

export = { createProject, listProjects, deleteProject };
