import { useMemo, Ref } from "react";

export function useMergeRefs<T>(refs: Array<Ref<T> | undefined>) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (value: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") ref(value);
        else if (ref != null) (ref as any).current = value;
      });
    };
  }, [refs]);
}
