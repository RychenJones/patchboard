import type { BugPriority, BugStatus } from "../models/bug";

type BugStatusOption = readonly [
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

const BUG_PRIORITY_OPTIONS: readonly BugPriority[] = [
  "low",
  "medium",
  "high",
];

function isBugPriority(value: unknown): value is BugPriority {
  return BUG_PRIORITY_OPTIONS.includes(value as BugPriority);
}

export = {
  BUG_STATUS_OPTIONS,
  BUG_PRIORITY_OPTIONS,
  isBugStatus,
  isBugPriority,
};
