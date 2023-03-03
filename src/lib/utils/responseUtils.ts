export function json<T>(body: T): Response;
export function json<T>(statusCode: number, body: T): Response;
export function json<T>(statusCodeOrBody: T | number, body?: T): Response {
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
