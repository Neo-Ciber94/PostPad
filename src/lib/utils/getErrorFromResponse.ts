// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getErrorFromResponse(response: Response): Promise<unknown | null> {
  if (response.headers.get("Content-Type") === "application/json") {
    const json = await response.json();

    if (json == null) {
      return null;
    }

    try {
      return JSON.stringify(json);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const text = await response.text();
  return text;
}
