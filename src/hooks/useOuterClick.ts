import { useEffect } from "react";

export interface UseOuterClickOptions {
  ref: React.RefObject<HTMLElement>;
  event?: "click" | "mousedown" | "mouseup";
  onClickOutside: (event: MouseEvent) => void;
  onClick?: (event: MouseEvent) => void;
}

export function useOuterClick({
  event = "click",
  onClickOutside,
  onClick,
  ref,
}: UseOuterClickOptions) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const el = event.target instanceof Node ? event.target : null;
      if (el == null || ref.current == null) {
        return;
      }

      if (!ref.current.contains(el)) {
        onClickOutside(event);
      } else {
        if (onClick) {
          onClick(event);
        }
      }
    };

    document.addEventListener(event, handleClick);
    return () => {
      document.removeEventListener(event, handleClick);
    };
  }, [ref, event, onClick, onClickOutside]);
}
