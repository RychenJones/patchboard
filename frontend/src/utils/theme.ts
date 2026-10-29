import { element } from "./dom";

const THEME_STORAGE_KEY = "patchboard-theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function applySavedTheme(): void {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(savedTheme === "dark" ? "dark" : "light");
}

export function createThemeToggle(): HTMLButtonElement {
  const button = element("button", "theme-toggle");
  button.type = "button";
  button.setAttribute("role", "switch");

  const track = element("span", "theme-toggle-track");
  const moon = element("span", "theme-toggle-moon");
  moon.textContent = "☾";
  const thumb = element("span", "theme-toggle-thumb");
  const sun = element("span", "theme-toggle-sun");
  sun.textContent = "☀";
  track.append(moon, thumb, sun);
  button.append(track);

  const updateLabel = (): void => {
    const isDark = document.documentElement.dataset.theme === "dark";
    button.dataset.state = isDark ? "dark" : "light";
    button.setAttribute("aria-checked", String(isDark));
    button.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
  };

  button.addEventListener("click", () => {
    const nextTheme: Theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    updateLabel();
  });

  updateLabel();
  return button;
}
