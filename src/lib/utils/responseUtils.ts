/**
 * Creates a `JSON` response.
 */
export function json<T extends object>(body: T): Response;

/**
 * Creates a `JSON` response.
 */
export function json<T extends object>(statusCode: number, body: T): Response;

/**
 * Creates a `JSON` response.
 */
export function json<T extends object>(
  statusCodeOrBody: T | number,
  body?: T
): Response {
  const jsonBody =
    body == null ? JSON.stringify(statusCodeOrBody) : JSON.stringify(body);
  const statusCode = body == null ? 200 : (statusCodeOrBody as number);

  return new Response(jsonBody, {
    status: statusCode,
    headers: {
      "content-type": "application/json",
    },
  });
}
