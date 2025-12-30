import React, { useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export const Portal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [node, setNode] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let root = document.getElementById("jigsaw-portal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "jigsaw-portal-root";
      document.body.appendChild(root);
    }
    setNode(root);
  }, []);

  return node ? createPortal(children, node) : null;
};
