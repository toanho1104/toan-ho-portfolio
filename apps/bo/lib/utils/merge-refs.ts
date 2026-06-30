import { useCallback, useEffect } from "react";

export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    });
  };
}

export function useSyncSelectDisplay(
  selectRef: React.RefObject<HTMLSelectElement | null>,
  setDisplayValue: (value: string) => void,
) {
  const sync = useCallback(() => {
    if (selectRef.current) setDisplayValue(selectRef.current.value);
  }, [selectRef, setDisplayValue]);

  useEffect(() => {
    sync();
    const id = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(id);
  }, [selectRef, sync]);

  return sync;
}
