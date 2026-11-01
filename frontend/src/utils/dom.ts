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
): void {
  root.replaceChildren(
    withChildren(
      element("main", `page-state ${kind}`),
      setText(element("p"), message),
    ),
  );
}
