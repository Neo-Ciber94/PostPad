import { useCallback, useState } from "react";

export type ValueUpdater<T> = (prev: T) => T;

export interface UseStateWithChangeResult<T> {
  readonly value: T;
  set: (newValue: T) => void;
  update: (updater: ValueUpdater<T>) => void;
}

/**
 * A hook similar to `useState` but that notifies on changes.
 */
export function useStateWithChange<T>(
  initialValue: T,
  onChange?: (newValue: T) => void
): UseStateWithChangeResult<T> {
  const [value, setValue] = useState(initialValue);

  const set = useCallback((newValue: T) => {
      setValue(newValue);

      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  // prettier-ignore
  const update = useCallback((updater: ValueUpdater<T>) => {
      const newValue = updater(value);
      set(newValue);
    },
    [set, value]
  );

  return { set, update, value };
}
