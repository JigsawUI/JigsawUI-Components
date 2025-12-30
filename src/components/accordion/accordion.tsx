import React, { createContext, useContext, useRef } from "react";
import { useAccordion, UseAccordionProps } from "./use-accordion";

const AccordionContext = createContext<ReturnType<typeof useAccordion> | null>(
  null
);

export const Accordion = ({
  children,
  className,
  ...props
}: UseAccordionProps & { children: React.ReactNode; className?: string }) => {
  const state = useAccordion(props);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const triggers = Array.from(
      rootRef.current?.querySelectorAll("[data-jigsaw-accordion-trigger]") || []
    ) as HTMLButtonElement[];

    const currentIndex = triggers.indexOf(
      document.activeElement as HTMLButtonElement
    );
    if (currentIndex === -1) return;

    let nextIndex = -1;
    switch (e.key) {
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % triggers.length;
        break;
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = triggers.length - 1;
        break;
      default:
        return;
    }

    if (nextIndex !== -1) {
      e.preventDefault();
      triggers[nextIndex].focus();
    }
  };

  return (
    <AccordionContext.Provider value={state}>
      <div ref={rootRef} onKeyDown={handleKeyDown} className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const { value: activeValue } = useContext(AccordionContext)!;
  const isOpen = Array.isArray(activeValue)
    ? activeValue.includes(value)
    : activeValue === value;
  return <div data-jigsaw-state={isOpen ? "open" : "closed"}>{children}</div>;
};

export const AccordionTrigger = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  const { toggleItem, value: activeValue } = useContext(AccordionContext)!;
  const isOpen = Array.isArray(activeValue)
    ? activeValue.includes(value)
    : activeValue === value;

  return (
    <h3>
      <button
        type="button"
        data-jigsaw-accordion-trigger=""
        aria-expanded={isOpen}
        onClick={() => toggleItem(value)}
        style={{
          width: "100%",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {children}
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>
    </h3>
  );
};

export const AccordionContent = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  const { value: activeValue } = useContext(AccordionContext)!;
  const isOpen = Array.isArray(activeValue)
    ? activeValue.includes(value)
    : activeValue === value;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows 300ms ease",
        overflow: "hidden",
      }}
    >
      <div style={{ minHeight: 0 }}>
        <div style={{ padding: "1rem" }}>{children}</div>
      </div>
    </div>
  );
};
