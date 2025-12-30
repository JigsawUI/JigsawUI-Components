import { useState, useId, useCallback } from "react";

export interface UseTabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

export function useTabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
}: UseTabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;
  const baseId = useId();
  const setSelected = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  return {
    value: activeValue,
    setSelected,
    orientation,
    baseId,
  };
}

export type UseTabsReturn = ReturnType<typeof useTabs>;
