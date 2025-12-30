import { useState, useRef, useCallback } from "react";

export function useTooltip(delay = 200) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    timerRef.current = setTimeout(() => setIsOpen(true), delay);
  }, [delay]);

  const close = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen(false);
  }, []);

  return { isOpen, open, close };
}
