import { noop } from "../noop";

export interface DeferredPromise<T> {
  resolve: (value: T) => void;
  reject: (error?: unknown) => void;
}

/**
 * Returns a promise that can be resolve lazily.
 * @param timeout An optional timeout to cancel the promise.
 * @returns The promise and two functions to resolve or reject the promise.
 */
export function deferredPromise<T = void>(
  timeout?: number
): [DeferredPromise<T>, Promise<T>] {
  let resolve = noop;
  let reject = noop;

  let resolved = false;
  let timerId = 0;

  if (timeout && timeout > 0) {
    timerId = window.setTimeout(() => {
      if (!resolved) {
        reject(new Error("Timeout"));
      }
    }, timeout);
  }

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = (value: T) => resolvePromise(value);
    reject = (error?: unknown) => rejectPromise(error);
  }).finally(() => {
    resolved = true;
    if (timerId) {
      clearTimeout(timerId);
    }
  });

  return [{ resolve, reject }, promise];
}
