const POSSIBLE_ERRORS_KEY = ["message", "messages", "error", "errors"];

/**
 * Attempt to extract the error message from an object.
 * @param err The error.
 * @returns The extracted error message.
 */
export function getErrorMessage(err: any): string | null {
  if (err == null) {
    return null;
  }

  if (typeof err === "string") {
    return err;
  }

  if (Array.isArray(err)) {
    return getErrorMessage(err[0]);
  }

  if (typeof err === "object") {
    for (const key in POSSIBLE_ERRORS_KEY) {
      if (key in err) {
        return getErrorMessage(err[key]);
      }
    }
  }

  return JSON.stringify(err);
}
