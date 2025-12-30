import React, { useLayoutEffect } from "react";

export const Overlay: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { lockScroll?: boolean }
> = ({ lockScroll = true, ...props }) => {
  useLayoutEffect(() => {
    if (!lockScroll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lockScroll]);

  return (
    <div
      data-jigsaw-overlay=""
      style={{ position: "fixed", inset: 0, zIndex: 40 }}
      {...props}
    />
  );
};
