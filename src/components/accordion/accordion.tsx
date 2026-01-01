import React, {
  createContext,
  useContext,
  useId,
  forwardRef,
  useRef,
} from "react";
import { useAccordion, UseAccordionProps } from "./use-accordion";

const AccordionContext = createContext<ReturnType<typeof useAccordion> | null>(
  null
);
const AccordionItemContext = createContext<{
  value: string;
  triggerId: string;
  contentId: string;
} | null>(null);

export const Accordion = forwardRef(
  (
    { children, ...props }: UseAccordionProps & { children: React.ReactNode },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const state = useAccordion(props);
    const rootRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const triggers = Array.from(
        rootRef.current?.querySelectorAll("[data-jigsaw-accordion-trigger]") ||
          []
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
        <div
          ref={(node) => {
            (rootRef as any).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as any).current = node;
          }}
          onKeyDown={handleKeyDown}
          {...state.getRootProps()}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

export const AccordionItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const { getItemProps } = useContext(AccordionContext)!;
  const id = useId();
  const triggerId = `trigger-${id}`;
  const contentId = `content-${id}`;

  return (
    <AccordionItemContext.Provider value={{ value, triggerId, contentId }}>
      <div {...getItemProps(value)}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionTrigger = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { getTriggerProps } = useContext(AccordionContext)!;
  const { value, triggerId, contentId } = useContext(AccordionItemContext)!;

  return (
    <h3 style={{ margin: 0 }}>
      <button
        className={className}
        {...getTriggerProps(value, triggerId, contentId)}
      >
        {children}
      </button>
    </h3>
  );
};

export const AccordionContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getContentProps } = useContext(AccordionContext)!;
  const { value, contentId, triggerId } = useContext(AccordionItemContext)!;
  const props = getContentProps(value, contentId, triggerId);

  return (
    <div
      {...props}
      style={{
        display: props.hidden ? "none" : "block",
        overflow: "hidden",
      }}
    >
      <div>{children}</div>
    </div>
  );
};
