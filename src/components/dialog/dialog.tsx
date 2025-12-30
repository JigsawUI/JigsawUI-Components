import React, { createContext, useContext, useCallback } from "react";
import { useDialog, UseDialogProps } from "./use-dialog";
import { Presence, Portal, Overlay, FocusScope } from "../../primitives";

const DialogContext = createContext<ReturnType<typeof useDialog> | null>(null);

export const Dialog = ({
  children,
  ...props
}: UseDialogProps & { children: React.ReactNode }) => {
  const value = useDialog(props);
  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};

export const DialogTrigger = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { setIsOpen } = useContext(DialogContext)!;
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen(true);
    },
  } as any);
};
export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, setIsOpen, labelId, descriptionId } =
    useContext(DialogContext)!;

  // 1. ADD THIS HANDLER BACK IN
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [setIsOpen]
  );

  return (
    <Presence present={isOpen}>
      <Portal>
        <Overlay onClick={() => setIsOpen(false)} lockScroll={true} />
        <FocusScope trap={isOpen} autoFocus={isOpen} restoreFocus={isOpen}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            onKeyDown={onKeyDown} // 2. THIS NOW HAS A REFERENCE
            tabIndex={-1}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 100,
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "90vw",
              maxWidth: "500px",
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

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  const { labelId } = useContext(DialogContext)!;
  return <h2 id={labelId}>{children}</h2>;
};

export const DialogClose = ({ children }: { children: React.ReactElement }) => {
  const { setIsOpen } = useContext(DialogContext)!;
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen(false);
    },
  } as any);
};
