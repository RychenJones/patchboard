import fs = require("node:fs");
import path = require("node:path");
import sqlite3 = require("sqlite3");

const dataDirectory = path.join(process.cwd(), "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const databasePath =
  process.env.DATABASE_PATH ?? path.join(dataDirectory, "patchboard.db");

const database = new sqlite3.Database(databasePath);

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

export = { databasePath, database, execute };
