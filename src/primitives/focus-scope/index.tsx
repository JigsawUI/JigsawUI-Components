import React, { useRef, useEffect, useCallback } from "react";

function getTabbableElements(container: HTMLElement) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: HTMLElement) => {
      if ((node as any).disabled || node.tabIndex < 0)
        return NodeFilter.FILTER_SKIP;
      return node.matches(
        "a[href], button, input, select, textarea, [tabindex]"
      )
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });
  const nodes: HTMLElement[] = [];
  let node = walker.nextNode();
  while (node) {
    nodes.push(node as HTMLElement);
    node = walker.nextNode();
  }
  return nodes;
}

export const FocusScope: React.FC<{
  children: React.ReactNode;
  trap?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}> = ({ children, trap, autoFocus, restoreFocus }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (restoreFocus)
      previousFocus.current = document.activeElement as HTMLElement;
    if (autoFocus && containerRef.current) {
      getTabbableElements(containerRef.current)[0]?.focus();
    }
    return () => previousFocus.current?.focus();
  }, [autoFocus, restoreFocus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!trap || e.key !== "Tab") return;
      const elements = getTabbableElements(containerRef.current!);
      if (elements.length === 0) return;

      if (e.shiftKey && document.activeElement === elements[0]) {
        e.preventDefault();
        elements[elements.length - 1].focus();
      } else if (
        !e.shiftKey &&
        document.activeElement === elements[elements.length - 1]
      ) {
        e.preventDefault();
        elements[0].focus();
      }
    },
    [trap]
  );

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
};
