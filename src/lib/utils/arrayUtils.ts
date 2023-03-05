/**
 * Splits the array using the given condition, returning two arrays, the first which contains
 * the items that matches the condition and the second the rest of items.
 * @param array The array to split.
 * @param condition The condition used to split the array.
 * @returns Two arrays, the left that matches the condition and the right the rest of items.
 */
export function arrayPartition<T>(
  array: T[],
  condition: (value: T) => boolean
): [T[], T[]] {
  const matches = array.filter(condition);
  const rest = array.filter((x) => !condition(x));
  return [matches, rest];
}
