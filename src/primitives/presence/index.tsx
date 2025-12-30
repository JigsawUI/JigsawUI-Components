import React, { useState, useLayoutEffect, useRef } from "react";

export const Presence: React.FC<{
  present: boolean;
  children:
    | React.ReactElement
    | ((props: { "data-jigsaw-state": string }) => React.ReactElement);
}> = ({ present, children }) => {
  const [render, setRender] = useState(present);
  const [state, setState] = useState(present ? "open" : "closed");
  const timerRef = useRef<Timer | null>(null);

  useLayoutEffect(() => {
    if (present) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setRender(true);
      setState("open");
    } else {
      setState("closed");
      // Fallback for environments where animationEnd never fires (like Tests)
      timerRef.current = setTimeout(() => {
        setRender(false);
      }, 500); // Match your longest transition time
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [present]);

  const onAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target === e.currentTarget && state === "closed") {
      setRender(false);
    }
  };

  if (!render) return null;

  const childProps = {
    "data-jigsaw-state": state,
    onAnimationEnd: (e: React.AnimationEvent) => {
      if (typeof children !== "function") {
        (children as any).props.onAnimationEnd?.(e);
      }
      onAnimationEnd(e);
    },
  };

  return typeof children === "function"
    ? children(childProps)
    : React.cloneElement(children as React.ReactElement, childProps);
};
