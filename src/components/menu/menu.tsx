import React, { createContext, useContext, useRef, useCallback } from "react";
import { useMenu } from "./use-menu";
import { Presence, Portal, FocusScope } from "../../primitives";

const MenuContext = createContext<ReturnType<typeof useMenu> | null>(null);

export const Menu = ({ children }: { children: React.ReactNode }) => {
  const value = useMenu();
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const MenuTrigger = ({ children }: { children: React.ReactElement }) => {
  const { open, setIsOpen, isOpen } = useContext(MenuContext)!;
  return React.cloneElement(children, {
    onClick: () => setIsOpen(!isOpen),
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
  } as any);
};

export const MenuContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, close, activeIndex, setActiveIndex } =
    useContext(MenuContext)!;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTypeAhead = useCallback(
    (key: string) => {
      const items = Array.from(
        menuRef.current?.querySelectorAll('[role="menuitem"]') || []
      ) as HTMLElement[];

      const char = key.toLowerCase();
      const match = items.find((item) =>
        item.textContent?.trim().toLowerCase().startsWith(char)
      );

      if (match) {
        const index = items.indexOf(match);
        setActiveIndex(index);
        match.focus();
      }
    },
    [setActiveIndex]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll('[role="menuitem"]') || []
    ) as HTMLElement[];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const next = (activeIndex + 1) % items.length;
        setActiveIndex(next);
        items[next].focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        const prev = (activeIndex - 1 + items.length) % items.length;
        setActiveIndex(prev);
        items[prev].focus();
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Home":
        e.preventDefault();
        items[0].focus();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        items[items.length - 1].focus();
        setActiveIndex(items.length - 1);
        break;
      case "Tab":
        close();
        break;
      default:
        if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
          handleTypeAhead(e.key);
        }
        break;
    }
  };

  return (
    <Presence present={isOpen}>
      <Portal>
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40 }}
          onClick={close}
        />
        <FocusScope trap={isOpen} autoFocus={isOpen} restoreFocus={true}>
          <div
            ref={menuRef}
            role="menu"
            onKeyDown={handleKeyDown}
            style={{
              position: "absolute",
              top: "60px",
              left: "20px",
              zIndex: 50,
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "4px",
              minWidth: "160px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              outline: "none",
            }}
          >
            {children}
          </div>
        </FocusScope>
      </Portal>
    </Presence>
  );
};

export const MenuItem = ({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) => {
  const { close } = useContext(MenuContext)!;

  return (
    <div
      role="menuitem"
      tabIndex={-1}
      onClick={() => {
        onSelect?.();
        close();
      }}
      onMouseEnter={(e) => (e.currentTarget as HTMLElement).focus()}
      style={{
        padding: "8px 12px",
        cursor: "pointer",
        borderRadius: "4px",
        outline: "none",
        fontSize: "14px",
        userSelect: "none",
      }}
    >
      {children}
    </div>
  );
};
