import dashboardRepository = require("../repositories/dashboardRepository");
import type { Dashboard } from "../models/project";

// Retrieve the dashboard summary from the repository.
function getDashboard(): Promise<Dashboard> {
  return dashboardRepository.getDashboard();
}

export = { getDashboard };
