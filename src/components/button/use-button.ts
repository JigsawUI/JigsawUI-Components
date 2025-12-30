import React from "react";

export interface UseButtonProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: React.EventHandler<any>;
}

export function useButton(props: UseButtonProps, isAnchor: boolean) {
  const { isDisabled, isLoading, type = "button", onClick } = props;

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAnchor && (e.key === " " || e.key === "Enter")) {
      if (isDisabled) e.preventDefault();
      if (e.key === " ") {
        (e.currentTarget as HTMLElement).click();
      }
    }
  };

  return {
    buttonProps: {
      role: "button",
      tabIndex: isDisabled ? -1 : 0,
      type: isAnchor ? undefined : type,
      "aria-disabled": isDisabled ? true : undefined,
      "aria-busy": isLoading ? true : undefined,
      "data-jigsaw-btn": "",
      "data-jigsaw-state": isLoading
        ? "loading"
        : isDisabled
        ? "disabled"
        : "active",
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    },
    state: {
      isLoading,
      isDisabled,
    },
  };
}
