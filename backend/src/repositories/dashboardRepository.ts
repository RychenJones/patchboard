import databaseModule = require("../db/database");
import type {
  Dashboard,
  DashboardBug,
  DashboardProject,
  PriorityCounts,
} from "../models/project";

const { queryAll } = databaseModule;

interface DashboardProjectRow {
  id: number;
  name: string;
  createdAt: string;
  openBugCount: number;
  lowPriorityCount: number;
  mediumPriorityCount: number;
  highPriorityCount: number;
}

interface DashboardBugRow extends DashboardBug {
  projectId: number;
}

async function getDashboard(): Promise<Dashboard> {
  const projectRows = await queryAll<DashboardProjectRow>(
    `SELECT p.id,
            p.name,
            strftime('%Y-%m-%dT%H:%M:%fZ', p.created_at) AS createdAt,
            COALESCE(SUM(CASE WHEN b.status != 'completed' THEN 1 ELSE 0 END), 0)
              AS openBugCount,
            COALESCE(SUM(CASE WHEN b.status != 'completed'
                              AND b.priority = 'low' THEN 1 ELSE 0 END), 0)
              AS lowPriorityCount,
            COALESCE(SUM(CASE WHEN b.status != 'completed'
                              AND b.priority = 'medium' THEN 1 ELSE 0 END), 0)
              AS mediumPriorityCount,
            COALESCE(SUM(CASE WHEN b.status != 'completed'
                              AND b.priority = 'high' THEN 1 ELSE 0 END), 0)
              AS highPriorityCount
     FROM projects p
     LEFT JOIN bugs b ON b.project_id = p.id
     GROUP BY p.id
     ORDER BY p.id ASC`,
  );

  const nextUpRows = await queryAll<DashboardBugRow>(
    `SELECT project_id AS projectId,
            id,
            title,
            priority,
            status,
            strftime('%Y-%m-%dT%H:%M:%fZ', created_at) AS createdAt
     FROM bugs
     WHERE status != 'completed'
     ORDER BY CASE priority
                WHEN 'high' THEN 1
                WHEN 'medium' THEN 2
                WHEN 'low' THEN 3
              END,
              created_at ASC,
              id ASC`,
  );

  const nextUpByProject = new Map<number, DashboardBug>();
  for (const bug of nextUpRows) {
    if (!nextUpByProject.has(bug.projectId)) {
      const { projectId: _projectId, ...dashboardBug } = bug;
      nextUpByProject.set(bug.projectId, dashboardBug);
    }
  }

  const projects: DashboardProject[] = projectRows.map((project) => {
    const priorityCounts: PriorityCounts = {
      low: project.lowPriorityCount,
      medium: project.mediumPriorityCount,
      high: project.highPriorityCount,
    };

    return {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      openBugCount: project.openBugCount,
      priorityCounts,
      nextUp: nextUpByProject.get(project.id) ?? null,
    };
  });

  return {
    totalProjects: projects.length,
    totalOpenBugs: projects.reduce(
      (total, project) => total + project.openBugCount,
      0,
    ),
    projects,
  };
}

export = { getDashboard };
