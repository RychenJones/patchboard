import type { BugStatus } from "../models/bug";

export type BugStatusOption = readonly [
  value: BugStatus,
  label: string,
];

const BUG_STATUS_OPTIONS: readonly BugStatusOption[] = [
  ["incomplete", "Not started"],
  ["in-progress", "Currently being worked on"],
  ["completed", "Finished"],
];

function isBugStatus(value: unknown): value is BugStatus {
  return BUG_STATUS_OPTIONS.some(([status]) => status === value);
}

export = { BUG_STATUS_OPTIONS, isBugStatus };
