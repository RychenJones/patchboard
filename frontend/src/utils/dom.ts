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

export function setText<T extends HTMLElement>(node: T, text: string): T {
  node.textContent = text;
  return node;
}

export function withChildren<T extends HTMLElement>(
  node: T,
  ...children: Node[]
): T {
  node.append(...children);
  return node;
}

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
