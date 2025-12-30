import { ElementType, ComponentPropsWithRef, PropsWithChildren } from "react";

export type AsProp<T extends ElementType> = { as?: T };
export type PolymorphicRef<T extends ElementType> =
  ComponentPropsWithRef<T>["ref"];
export type PolymorphicProps<T extends ElementType, P = {}> = PropsWithChildren<
  P & AsProp<T>
> &
  Omit<ComponentPropsWithRef<T>, keyof (AsProp<T> & P)>;
