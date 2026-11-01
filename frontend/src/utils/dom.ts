// Create an element and optionally assign its CSS class.
export function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }
  return node;
}

// Set safe text content and return the updated element.
export function setText<T extends HTMLElement>(node: T, text: string): T {
  node.textContent = text;
  return node;
}

// Append child nodes and return the parent element.
export function withChildren<T extends HTMLElement>(
  node: T,
  ...children: Node[]
): T {
  node.append(...children);
  return node;
}

// Replace the page with a loading, error, or empty state.
export function showMessage(
  root: HTMLDivElement,
  message: string,
  kind: "loading" | "error" | "empty",
  action?: { label: string; onClick: () => void },
): void {
  const content = element("div", "page-state-content");
  const messageElement = setText(element("p"), message);
  if (kind === "error") {
    messageElement.setAttribute("role", "alert");
    messageElement.tabIndex = -1;
  }
  content.append(messageElement);
  if (action) {
    const actionButton = element("button", "primary-button");
    actionButton.type = "button";
    actionButton.textContent = action.label;
    actionButton.addEventListener("click", action.onClick);
    content.append(actionButton);
  }
  root.replaceChildren(
    withChildren(element("main", `page-state ${kind}`), content),
  );
  if (kind === "error") messageElement.focus();
}

// Show an error beside already-rendered content without replacing the page.
export function showInlineError(container: HTMLElement, message: string): void {
  let errorElement = container.querySelector<HTMLElement>(":scope > .inline-error");
  if (!errorElement) {
    errorElement = element("p", "inline-error");
    errorElement.setAttribute("role", "alert");
    errorElement.tabIndex = -1;
    container.prepend(errorElement);
  }
  errorElement.textContent = message;
  errorElement.focus();
}
