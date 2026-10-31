import fs = require("node:fs");
import os = require("node:os");
import path = require("node:path");

// This module is loaded before test modules, so database.ts never sees the
// development database path during a Jest run.
const testDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "patchboard-jest-"),
);
process.env.DATABASE_PATH = path.join(testDirectory, "patchboard.db");
