/**
 * Returns a promise that resolves after the given number of milliseconds.
 * @param ms The number of milliseconds to wait.
 */
export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
