const sharedStatusModule = (await import("../../../shared/bugStatuses")).default;
import type { BugStatus } from "../../../shared/bugStatuses";
const sharedPriorityModule = (await import("../../../shared/bugPriorities")).default;
import type { BugPriority } from "../../../shared/bugPriorities";

const { BUG_STATUS_OPTIONS } = sharedStatusModule;
const { BUG_PRIORITY_OPTIONS } = sharedPriorityModule;

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function statusLabel(status: BugStatus): string {
  return BUG_STATUS_OPTIONS.find(([value]) => value === status)?.[1] ?? status;
}

export function priorityLabel(priority: BugPriority): string {
  return BUG_PRIORITY_OPTIONS.find(([value]) => value === priority)?.[1] ?? priority;
}
