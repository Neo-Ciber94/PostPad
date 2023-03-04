/**
 * Represents either a value or a function that returns a value.
 */
export type ValueOrFactory<T> = T | (() => T);

/**
 * Gets the value from the given value or function.
 */
export function getValueOrFactory<T>(valueOrFactory: ValueOrFactory<T>): T {
  if (typeof valueOrFactory === "function") {
    const f = valueOrFactory as () => T;
    return f();
  }

  return valueOrFactory;
}
