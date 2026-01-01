import { useState, useCallback } from "react";

export interface UseAccordionProps {
  defaultValue?: string | string[];
  type?: "single" | "multiple";
  onValueChange?: (value: string | string[]) => void;
}

export function useAccordion({
  defaultValue,
  type = "single",
  onValueChange,
}: UseAccordionProps) {
  const [value, setValue] = useState<string | string[]>(
    defaultValue ?? (type === "single" ? "" : [])
  );

  const isExpanded = useCallback(
    (itemValue: string) => {
      return type === "single"
        ? value === itemValue
        : (value as string[]).includes(itemValue);
    },
    [value, type]
  );

  const toggleItem = useCallback(
    (itemValue: string) => {
      let nextValue: string | string[];

      if (type === "single") {
        nextValue = value === itemValue ? "" : itemValue;
      } else {
        const prevValue = Array.isArray(value) ? value : [];
        nextValue = prevValue.includes(itemValue)
          ? prevValue.filter((v) => v !== itemValue)
          : [...prevValue, itemValue];
      }

      setValue(nextValue);
      onValueChange?.(nextValue);
    },
    [value, type, onValueChange]
  );

  return {
    value,
    toggleItem,
    type,
    isExpanded, // Add this back
    getRootProps: () => ({
      "data-jigsaw-accordion": "",
      "data-orientation": "vertical",
    }),
    getItemProps: (itemValue: string) => ({
      "data-state": isExpanded(itemValue) ? "open" : "closed",
      "data-jigsaw-accordion-item": "",
    }),
    getTriggerProps: (itemValue: string, id: string, panelId: string) => ({
      id,
      "aria-expanded": isExpanded(itemValue),
      "aria-controls": panelId,
      "data-state": isExpanded(itemValue) ? "open" : "closed",
      "data-jigsaw-accordion-trigger": "",
      onClick: () => toggleItem(itemValue),
      type: "button" as const,
    }),
    getContentProps: (itemValue: string, id: string, triggerId: string) => ({
      id,
      role: "region",
      "aria-labelledby": triggerId,
      "data-state": isExpanded(itemValue) ? "open" : "closed",
      hidden: !isExpanded(itemValue),
    }),
  };
}
