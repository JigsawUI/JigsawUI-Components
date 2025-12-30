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

  return { value, toggleItem, type };
}
