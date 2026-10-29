import { renderDashboard } from "./render/dashboard";
import { renderProject } from "./render/projectView";
import "./styles.css";
import { applySavedTheme } from "./utils/theme";

const appRootCandidate = document.querySelector<HTMLDivElement>("#app");

if (!appRootCandidate) {
  throw new Error("The application root was not found.");
}

const appRoot = appRootCandidate;
applySavedTheme();

function renderRoute(): void {
  const match = window.location.hash.match(/^#\/projects\/(\d+)$/);
  if (match?.[1]) {
    void renderProject(appRoot, Number(match[1]));
    return;
  }

  void renderDashboard(appRoot);
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
