export type BugPriority = "low" | "medium" | "high";
export type BugStatus = "incomplete" | "in-progress" | "completed";

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
