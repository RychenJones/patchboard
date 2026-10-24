import databaseModule = require("./database");

const { database, execute } = databaseModule;

const migrationStatements = [
  "PRAGMA foreign_keys = ON",
  `CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS bugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'incomplete'
      CHECK (status IN ('incomplete', 'in-progress', 'completed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_bugs_project_id
    ON bugs(project_id)`,
  `CREATE TRIGGER IF NOT EXISTS set_bugs_updated_at
    AFTER UPDATE ON bugs
    FOR EACH ROW
    BEGIN
      UPDATE bugs
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = OLD.id;
    END`,
];

async function runMigrations(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    database.serialize(async () => {
      try {
        for (const statement of migrationStatements) {
          await execute(statement);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

export = { runMigrations };
