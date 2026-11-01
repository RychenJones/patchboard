import type { BugStatus } from "../../../shared/bugStatuses";
import type { BugPriority } from "../../../shared/bugPriorities";

export type { BugStatus } from "../../../shared/bugStatuses";
export type { BugPriority } from "../../../shared/bugPriorities";

export interface Bug {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  priority: BugPriority;
  status: BugStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBugInput {
  projectId: number;
  title: string;
  description?: string;
  priority?: BugPriority;
  status?: BugStatus;
}

export interface UpdateBugInput {
  title?: string;
  description?: string | null;
  priority?: BugPriority;
  status?: BugStatus;
}
