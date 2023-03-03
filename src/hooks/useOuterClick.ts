import { useEffect, useRef } from "react";

export interface UseDetectClickOutsideOptions {
  event?: "click" | "mousedown" | "mouseup";
  onClickOutside?: (event: MouseEvent) => void;
}

export function useOuterClick<T extends HTMLElement>({
  event = "mousedown",
  onClickOutside,
}: UseDetectClickOutsideOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const el = event.target as HTMLElement;
      if (el && ref.current && !el.contains(ref.current)) {
        if (onClickOutside) {
          onClickOutside(event);
        }
      }
    };

    window.addEventListener(event, handleClick);
    return () => {
      window.removeEventListener(event, handleClick);
    };
  }, [ref, event, onClickOutside]);

  return ref;
}
