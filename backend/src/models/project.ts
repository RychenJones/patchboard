export interface Project {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateProjectInput {
  name: string;
}

export interface UpdateProjectInput {
  name?: string;
}

export interface PriorityCounts {
  low: number;
  medium: number;
  high: number;
}

export interface DashboardBug {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  status: "incomplete" | "in-progress" | "completed";
  createdAt: string;
}

export interface DashboardProject extends Project {
  openBugCount: number;
  priorityCounts: PriorityCounts;
  nextUp: DashboardBug | null;
}

export interface Dashboard {
  totalProjects: number;
  totalOpenBugs: number;
  projects: DashboardProject[];
}
