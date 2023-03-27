export function createObjectFromSearchParams(searchParams: URLSearchParams) {
  const obj: Record<string, unknown> = {};

  for (const [key, value] of searchParams.entries()) {
    const objValue = obj[key];

    if (objValue) {
      if (Array.isArray(objValue)) {
        obj[key] = [...objValue, value];
      } else {
        obj[key] = [objValue, value];
      }
    } else {
      obj[key] = value;
    }
  }

  return obj;
}
