
/**
 * Throw an error if the response is not successful.
 */
export async function throwOnResponseError(res: Response) {
  if (res.ok) {
    return;
  }

  const isJson = res.headers.get("Content-Type") === "application/json";

  if (isJson) {
    throw await res.json();
  } else {
    throw await res.text();
  }
}
