/**
 * Get the given array or convert the value in an array.
 */
export function getArray<T>(valueOrArray: T | T[]): T[] {
  if (Array.isArray(valueOrArray)) {
    return valueOrArray;
  }

  return [valueOrArray];
}
