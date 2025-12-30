import { useState, useCallback, useId } from "react";

export interface UseDialogProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useDialog({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: UseDialogProps = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen =
    controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const setIsOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const labelId = useId();
  const descriptionId = useId();

  return { isOpen, setIsOpen, labelId, descriptionId };
}
