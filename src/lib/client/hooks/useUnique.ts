"use client";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

const UNIQUE_VALUE_KEY = "__unique";

/**
 * Returns a shared unique random `string`, saved until the page session ends.
 */
export function useUnique<T = string>(map?: (s: string) => T): T {
  const [unique, setUnique] = useState("");

  useEffect(() => {
    let value = sessionStorage.getItem(UNIQUE_VALUE_KEY);
    if (!value) {
      value = nanoid();
      sessionStorage.setItem(UNIQUE_VALUE_KEY, value);
    }

    setUnique(value);
  }, []);

  return map == null ? <T>unique : map(unique);
}
