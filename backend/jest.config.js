/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: { parser: { syntax: "typescript" } },
        module: { type: "commonjs" },
      },
    ],
  },
  setupFiles: ["<rootDir>/tests/setTestDatabase.ts"],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  clearMocks: true,
};
