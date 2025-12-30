import React, { forwardRef, ElementType } from "react";
import { PolymorphicProps, PolymorphicRef } from "../../utils/polymorphic";
import { useButton, UseButtonProps } from "./use-button";

interface ButtonOwnProps extends UseButtonProps {
  className?: string;
}

export const Button = forwardRef(((
  {
    as,
    children,
    isLoading = false,
    isDisabled = false,
    onClick,
    type,
    ...props
  }: PolymorphicProps<ElementType, ButtonOwnProps>,
  ref: PolymorphicRef<any>
) => {
  const Component = as || "button";
  const isAnchor = as === "a" || "href" in props;

  const { buttonProps } = useButton(
    {
      isLoading,
      isDisabled,
      type: type as any,
      onClick,
    },
    isAnchor
  );

  return (
    <Component ref={ref} {...buttonProps} {...props}>
      {isLoading && (
        <span
          data-jigsaw-loader=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <span
        data-jigsaw-label=""
        style={{
          display: "contents",
          visibility: isLoading ? "hidden" : "visible",
        }}
      >
        {children}
      </span>
    </Component>
  );
}) as any) as unknown as <T extends ElementType = "button">(
  props: PolymorphicProps<T, ButtonOwnProps> & { ref?: PolymorphicRef<T> }
) => React.JSX.Element & { displayName?: string };

(Button as any).displayName = "JigsawButton";
