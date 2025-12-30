import { useState, useCallback } from "react";

export function useMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  return { isOpen, setIsOpen, open, close, activeIndex, setActiveIndex };
}
