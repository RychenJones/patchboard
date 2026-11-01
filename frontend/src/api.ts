import type {
  Bug,
  BugPriority,
  BugStatus,
  Dashboard,
  Project,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Send API requests and turn unsuccessful responses into readable errors.
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

// Load and modify dashboard and project records through the backend API.
// Fetch the dashboard summary for the overview screen.
export function getDashboard(): Promise<Dashboard> {
  return request<Dashboard>("/api/dashboard");
}

// Fetch one project by its numeric identifier.
export function getProject(projectId: number): Promise<Project> {
  return request<Project>(`/api/projects/${projectId}`);
}

// Fetch all bugs belonging to a project.
export function getBugs(projectId: number): Promise<Bug[]> {
  return request<Bug[]>(`/api/projects/${projectId}/bugs`);
}

// Create a project from its submitted name.
export function createProject(name: string): Promise<Project> {
  return request<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// Rename an existing project through the backend API.
export function updateProject(projectId: number, name: string): Promise<Project> {
  return request<Project>(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

// Delete a project and return when the request succeeds.
export function deleteProject(projectId: number): Promise<void> {
  return request<void>(`/api/projects/${projectId}`, {
    method: "DELETE",
  });
}

// Create, update, and remove bugs through the backend API.
// Create a bug with its title, priority, and optional description.
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

// Apply one or more editable fields to an existing bug.
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

// Delete a bug and return when the request succeeds.
export function deleteBug(bugId: number): Promise<void> {
  return request<void>(`/api/bugs/${bugId}`, {
    method: "DELETE",
  });
}
