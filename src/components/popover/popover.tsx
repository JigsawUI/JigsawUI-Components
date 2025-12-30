import React, { createContext, useContext } from "react";
import { usePopover, UsePopoverProps } from "./use-popover";
import { Presence, Portal, Overlay, FocusScope } from "../../primitives";
import { useMergeRefs } from "../../utils/use-merge-refs";

const PopoverContext = createContext<ReturnType<typeof usePopover> | null>(
  null
);

export const Popover = ({
  children,
  ...props
}: UsePopoverProps & { children: React.ReactNode }) => {
  const value = usePopover(props);
  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { isOpen, toggle, triggerId, contentId, refs } =
    useContext(PopoverContext)!;

  const childrenRef = (children as any).props?.ref;
  const mergedRef = useMergeRefs([refs.setReference, childrenRef]);

  return React.cloneElement(children, {
    ref: mergedRef,
    id: triggerId,
    onClick: toggle,
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": contentId,
    "data-jigsaw-state": isOpen ? "open" : "closed",
  } as any);
};

export const PopoverContent = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const { isOpen, setIsOpen, contentId, triggerId, refs, floatingStyles } =
    useContext(PopoverContext)!;

  return (
    <Presence present={isOpen}>
      <Portal>
        <Overlay
          onClick={() => setIsOpen(false)}
          style={{ background: "transparent" }}
          lockScroll={false}
        />

        <FocusScope trap autoFocus restoreFocus>
          <div
            ref={refs.setFloating}
            id={contentId}
            role="dialog"
            aria-labelledby={triggerId}
            data-jigsaw-state={isOpen ? "open" : "closed"}
            style={{
              ...floatingStyles,
              zIndex: 50,
              ...style,
            }}
          >
            {children}
          </div>
        </FocusScope>
      </Portal>
    </Presence>
  );
};
