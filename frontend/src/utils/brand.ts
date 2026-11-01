import { element, setText } from "./dom";

// Build the PatchBoard brand link used across application pages.
export function createBrandHeader(): HTMLElement {
  const header = element("nav", "brand-header");
  header.setAttribute("aria-label", "Primary navigation");

  const link = element("a", "brand-link");
  link.href = "#/";
  link.setAttribute("aria-label", "PatchBoard home");
  link.append(
    setText(element("span", "brand-mark"), "P"),
    setText(element("span"), "PatchBoard"),
  );
  header.append(link);
  return header;
}
