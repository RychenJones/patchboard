const sharedStatusModule = (await import("../../../shared/bugStatuses")).default;
import type { BugStatus } from "../../../shared/bugStatuses";
const sharedPriorityModule = (await import("../../../shared/bugPriorities")).default;
import type { BugPriority } from "../../../shared/bugPriorities";

const { BUG_STATUS_OPTIONS } = sharedStatusModule;
const { BUG_PRIORITY_OPTIONS } = sharedPriorityModule;

// Format an API timestamp for compact display in the UI.
export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

// Convert a shared status value into its visible label.
export function statusLabel(status: BugStatus): string {
  return BUG_STATUS_OPTIONS.find(([value]) => value === status)?.[1] ?? status;
}

// Convert a shared priority value into its visible label.
export function priorityLabel(priority: BugPriority): string {
  return BUG_PRIORITY_OPTIONS.find(([value]) => value === priority)?.[1] ?? priority;
}
