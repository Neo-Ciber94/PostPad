import { useCallback, useRef } from "react";

/**
 * Returns a function that when called return an id.
 * @param prefix An optional prefix for the id.
 * @returns A function that returns an id.
 */
export function useNextId(prefix?: string) {
  const nextIdRef = useRef<number>(1);

  const getNextId = useCallback(() => {
    const next = nextIdRef.current;
    nextIdRef.current += 1;
    return prefix == null ? String(next) : `${prefix}${next}`;
  }, [prefix, nextIdRef]);

  return getNextId;
}
