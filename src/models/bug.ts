export type BugStatus = "incomplete" | "in-progress" | "completed";

export interface Bug {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: BugStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBugInput {
  projectId: number;
  title: string;
  description?: string;
  status?: BugStatus;
}

export interface UpdateBugInput {
  title?: string;
  description?: string | null;
  status?: BugStatus;
}
