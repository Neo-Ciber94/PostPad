import { getValueOrFactory, ValueOrFactory } from "@/lib/utils/ValueOrFactory";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Delays the emission of a value.
 */
export function useDebounce<T>(valueOrFactory: ValueOrFactory<T>, ms: number) {
  const [value, setValue] = useState(getValueOrFactory(valueOrFactory));

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setValue(getValueOrFactory(valueOrFactory));
    }, ms);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, ms, valueOrFactory]);

  return value;
}

/**
 * Similar to `useState` but delays the update of the value the given number of milliseconds.
 * @param initialValue The initial value.
 * @param ms the amount of milliseconds to of delay.
 */
export function useDebounceState<T>(
  initialValue: ValueOrFactory<T>,
  ms: number
): [T, React.Dispatch<T>] {
  const [value, setValue] = useState(getValueOrFactory(initialValue));
  const prevValueRef = useRef<T>(value);
  let timeoutRef = useRef<number | null>(null);

  const setNewValue = useCallback(
    (newValue: React.SetStateAction<T>) => {
      const timeout = timeoutRef.current;

      // Clean up any previous timeout
      if (timeout) {
        clearTimeout(timeout);
      }

      // Starts a new timeout to set the new value
      timeoutRef.current = window.setTimeout(() => {
        prevValueRef.current = value;

        if (typeof newValue === "function") {
          const f = newValue as (prev: T) => T;
          const prev = prevValueRef.current;
          const val = f(prev);
          setValue(val);
        } else {
          setValue(newValue);
        }
      }, ms);
    },
    [ms, value]
  );

  useEffect(() => {
    const timeout = timeoutRef.current;
    if (timeout == null) {
      return;
    }

    // Clear the timeout on unmount
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeoutRef]);

  return [value, setNewValue];
}
