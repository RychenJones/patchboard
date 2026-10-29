import type {
  Bug,
  BugPriority,
  BugStatus,
  Dashboard,
  Project,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? ((await response.json()) as unknown)
    : null;

  if (!response.ok) {
    const errorMessage =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : `Request failed with status ${response.status}.`;
    throw new Error(errorMessage);
  }

  return body as T;
}

export function getDashboard(): Promise<Dashboard> {
  return request<Dashboard>("/api/dashboard");
}

export function getProject(projectId: number): Promise<Project> {
  return request<Project>(`/api/projects/${projectId}`);
}

export function getBugs(projectId: number): Promise<Bug[]> {
  return request<Bug[]>(`/api/projects/${projectId}/bugs`);
}

export function createProject(name: string): Promise<Project> {
  return request<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function createBug(
  projectId: number,
  title: string,
  priority: BugPriority,
  description?: string | null,
): Promise<Bug> {
  return request<Bug>(`/api/projects/${projectId}/bugs`, {
    method: "POST",
    body: JSON.stringify({ title, priority, description }),
  });
}

export function updateBug(
  bugId: number,
  updates: {
    title?: string;
    description?: string | null;
    priority?: BugPriority;
    status?: BugStatus;
  },
): Promise<Bug> {
  return request<Bug>(`/api/bugs/${bugId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}
