import { useEffect, useMemo } from "react";

export interface UseKeyboardEventOptions {
  keys?: string | string[]; // Add typing
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
}

export function useKeyboardEvent({
  keys,
  onKeyDown,
  onKeyUp,
}: UseKeyboardEventOptions) {
  const validKeys = useMemo(() => {
    if (keys == null) {
      return [];
    }

    return Array.isArray(keys) ? keys : [keys];
  }, [keys]);

  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      if (validKeys.length > 0 && !validKeys.includes(event.key)) {
        return;
      }

      switch (event.type) {
        case "keydown":
          onKeyDown?.(event);
          break;
        case "keyup":
          onKeyUp?.(event);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyEvent);
    window.addEventListener("keyup", handleKeyEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyEvent);
      window.removeEventListener("keyup", handleKeyEvent);
    };
  }, [onKeyDown, onKeyUp, validKeys]);
}
