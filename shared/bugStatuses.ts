// The backend is CommonJS while the frontend is ESM; TypeScript emits the
// default export as a CommonJS `.default` property for the backend build.
export type BugStatus = "incomplete" | "in-progress" | "completed";

export type BugStatusOption = readonly [
  value: BugStatus,
  label: string,
];

export const BUG_STATUS_OPTIONS: readonly BugStatusOption[] = [
  ["incomplete", "Created"],
  ["in-progress", "In progress"],
  ["completed", "Resolved"],
];

export function isBugStatus(value: unknown): value is BugStatus {
  return BUG_STATUS_OPTIONS.some(([status]) => status === value);
}

export default {
  BUG_STATUS_OPTIONS,
  isBugStatus,
};
