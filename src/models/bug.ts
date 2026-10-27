export type BugStatus = "incomplete" | "in-progress" | "completed";
export type BugPriority = "low" | "medium" | "high";

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
