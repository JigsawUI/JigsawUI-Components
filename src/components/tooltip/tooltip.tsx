import React, { useId } from "react";
import { useTooltip } from "./use-tooltip";
import { Presence, Portal } from "../../primitives";

export const Tooltip = ({
  children,
  content,
  delay = 200,
}: {
  children: React.ReactElement;
  content: string;
  delay?: number;
}) => {
  const { isOpen, open, close } = useTooltip(delay);
  const id = useId();

  return (
    <>
      {React.cloneElement(children, {
        "aria-describedby": isOpen ? id : undefined,
        onMouseEnter: open,
        onMouseLeave: close,
        onFocus: open,
        onBlur: close,
      } as any)}

      <Presence present={isOpen}>
        <Portal>
          <div
            id={id}
            role="tooltip"
            style={{
              position: "absolute",
              backgroundColor: "#1f2937",
              color: "white",
              padding: "6px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
              zIndex: 1000,
              pointerEvents: "none",
              transform: "translate(-50%, -100%)",
              marginTop: "-8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              whiteSpace: "nowrap",
            }}
          >
            {content}
            {/* Optional: Add a small triangle arrow here later */}
          </div>
        </Portal>
      </Presence>
    </>
  );
};
