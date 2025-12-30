import { useState, useCallback, useId } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  Placement,
} from "@floating-ui/react";

export interface UsePopoverProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offset?: number;
}

export function usePopover({
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  offset: offsetValue = 8,
}: UsePopoverProps = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (nextOpen) => {
      setIsOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    middleware: [
      offset(offsetValue),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
    placement,
  });

  const toggle = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    onOpenChange?.(next);
  }, [isOpen, onOpenChange]);

  return {
    isOpen,
    setIsOpen,
    toggle,
    refs,
    floatingStyles,
    context,
    triggerId: `jigsaw-popover-trigger-${id}`,
    contentId: `jigsaw-popover-content-${id}`,
  };
}
