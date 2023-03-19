import { useCallback, useEffect, useState } from "react";

export interface UseLocalStorageItemOptions<T> {
  parse?: (value: string) => T;
  stringify?: (value: T) => string;
  defaultValue?: T;
}

export type UseLocalStorageItemResult<T> = {
  get: () => T;
  set: (newValue: T) => void;
  remove: () => void;
};

export function useLocalStorageItem<T>(
  key: string,
  options: UseLocalStorageItemOptions<T> & { defaultValue: T }
): UseLocalStorageItemResult<T>;

export function useLocalStorageItem<T>(
  key: string,
  options?: UseLocalStorageItemOptions<T>
): UseLocalStorageItemResult<T | null>;

export function useLocalStorageItem<T = unknown>(
  key: string,
  options?: UseLocalStorageItemOptions<T>
): UseLocalStorageItemResult<T | null> {
  const {
    parse = JSON.parse,
    stringify = JSON.stringify,
    defaultValue = null,
  } = options || {};
  const [value, setValue] = useState<T | null>(defaultValue);

  useEffect(() => {
    const stringValue = localStorage.getItem(key);

    if (stringValue != null) {
      try {
        const newValue = parse(stringValue);
        setValue(newValue as T);
      } catch {
        setValue(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const get = useCallback(() => {
    return value;
  }, [value]);

  const set = useCallback(
    (newValue: T | null) => {
      const stringValue = stringify(newValue);
      localStorage.setItem(key, stringValue);
      setValue(newValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { get, set, remove };
}
