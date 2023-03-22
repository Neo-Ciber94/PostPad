
// We use this because `NextResponse.json` is failing.

/**
 * Creates a `JSON` response.
 * @param body The body of the json response.
 * @param init additional details for the request.
 */
export function json(body: unknown, init?: ResponseInit): Response {
  const json = JSON.stringify(body);
  return new Response(json, {
    ...init,
    headers: {
      ...init?.headers,
      "content-type": "application/json",
    },
  });
}
