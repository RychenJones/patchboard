import fs = require("node:fs");
import path = require("node:path");
import sqlite3 = require("sqlite3");

const dataDirectory = path.join(process.cwd(), "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const databasePath =
  process.env.DATABASE_PATH ?? path.join(dataDirectory, "patchboard.db");

const database = new sqlite3.Database(databasePath);

// Execute a database statement without returning rows.
function execute(sql: string, parameters: unknown[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(sql, parameters, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

// Execute a query and return every matching row.
function queryAll<T>(sql: string, parameters: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    database.all<T>(sql, parameters, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

// Execute a query and return its first row when one exists.
function queryOne<T>(sql: string, parameters: unknown[] = []): Promise<T | null> {
  return new Promise((resolve, reject) => {
    database.get<T>(sql, parameters, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row ?? null);
    });
  });
}

export = { databasePath, database, execute, queryAll, queryOne };
