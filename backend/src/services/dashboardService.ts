import dashboardRepository = require("../repositories/dashboardRepository");
import type { Dashboard } from "../models/project";

function getDashboard(): Promise<Dashboard> {
  return dashboardRepository.getDashboard();
}

export = { getDashboard };
