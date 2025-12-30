import React, { createContext, useContext, useRef, useId } from "react";
import { useTabs, UseTabsProps } from "./use-tabs";

const TabsContext = createContext<ReturnType<typeof useTabs> | null>(null);

export const Tabs = ({
  children,
  ...props
}: UseTabsProps & { children: React.ReactNode }) => {
  const value = useTabs(props);
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

export const TabList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { orientation, setSelected, value, baseId } = useContext(TabsContext)!;
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabs = Array.from(
      listRef.current?.querySelectorAll('[role="tab"]:not([disabled])') || []
    ) as HTMLButtonElement[];

    const currentIndex = tabs.findIndex(
      (tab) => tab.getAttribute("aria-selected") === "true"
    );
    let nextIndex = -1;

    if (orientation === "horizontal") {
      if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
      if (e.key === "ArrowLeft")
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else {
      if (e.key === "ArrowDown") nextIndex = (currentIndex + 1) % tabs.length;
      if (e.key === "ArrowUp")
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = tabs.length - 1;

    if (nextIndex !== -1) {
      e.preventDefault();
      const nextTab = tabs[nextIndex];
      const nextValue = nextTab.getAttribute("data-value");
      if (nextValue) {
        setSelected(nextValue);
        nextTab.focus();
      }
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={className}
      data-jigsaw-orientation={orientation}
    >
      {children}
    </div>
  );
};

export const Tab = ({
  value,
  children,
  disabled,
}: {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  const {
    value: selectedValue,
    setSelected,
    baseId,
  } = useContext(TabsContext)!;
  const isSelected = selectedValue === value;

  return (
    <button
      role="tab"
      type="button"
      id={`${baseId}-tab-${value}`}
      disabled={disabled}
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${value}`}
      data-value={value}
      data-jigsaw-state={isSelected ? "active" : "inactive"}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => setSelected(value)}
    >
      {children}
    </button>
  );
};

export const TabPanel = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const { value: selectedValue, baseId } = useContext(TabsContext)!;
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      data-jigsaw-state="active"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
