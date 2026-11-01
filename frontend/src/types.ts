export type { BugPriority } from "../../shared/bugPriorities";
import type { BugPriority } from "../../shared/bugPriorities";
export type { BugStatus } from "../../shared/bugStatuses";
import type { BugStatus } from "../../shared/bugStatuses";

export interface Project {
  id: number;
  name: string;
  createdAt: string;
}

export interface DashboardBug {
  id: number;
  title: string;
  priority: BugPriority;
  status: BugStatus;
  createdAt: string;
}

export interface DashboardProject extends Project {
  openBugCount: number;
  priorityCounts: Record<BugPriority, number>;
  nextUp: DashboardBug | null;
}

export interface Dashboard {
  totalProjects: number;
  totalOpenBugs: number;
  projects: DashboardProject[];
}

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
