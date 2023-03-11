import { useMemo } from "react";
import { nanoid } from "nanoid";

const UNIQUE_VALUE_KEY = "__unique";

/**
 * Returns a shared unique random `string`, saved until the page session ends.
 */
export function useUnique<T = string>(map?: (s: string) => T): T {
  const unique = useMemo(() => {
    let value = sessionStorage.getItem(UNIQUE_VALUE_KEY);

    if (!value) {
      value = nanoid();
      sessionStorage.setItem(UNIQUE_VALUE_KEY, value);
    }

    return value;
  }, []);

  return map == null ? <T>unique : map(unique);
}
