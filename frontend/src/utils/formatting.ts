import type { BugStatus } from "../types";

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function statusLabel(status: BugStatus): string {
  const labels: Record<BugStatus, string> = {
    incomplete: "Open",
    "in-progress": "In progress",
    completed: "Fixed",
  };
  return labels[status];
}
