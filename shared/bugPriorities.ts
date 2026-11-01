// The backend is CommonJS while the frontend is ESM; TypeScript emits the
// default export as a CommonJS `.default` property for the backend build.
export type BugPriority = "low" | "medium" | "high";

export type BugPriorityOption = readonly [
  value: BugPriority,
  label: string,
];

export const BUG_PRIORITY_OPTIONS: readonly BugPriorityOption[] = [
  ["low", "Low"],
  ["medium", "Medium"],
  ["high", "High"],
];

export function isBugPriority(value: unknown): value is BugPriority {
  return BUG_PRIORITY_OPTIONS.some(([priority]) => priority === value);
}

export default {
  BUG_PRIORITY_OPTIONS,
  isBugPriority,
};
