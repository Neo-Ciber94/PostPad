import { nanoid } from "nanoid";

const REPLACEMENT = "-";

export function generateSlug(str: string): string {
  if (str.length === 0) {
    throw new Error("string cannot be empty");
  }

  const id = nanoid();

  str = str
    .replaceAll(/[^a-zA-Z0-9]/g, REPLACEMENT)
    .split("")
    .filter((val, idx, items) => val !== REPLACEMENT || items[idx + 1] !== val)
    .join("");

  if (str.startsWith(REPLACEMENT)) {
    str = str.substring(1);
  }

  if (str.endsWith(REPLACEMENT)) {
    str = str.substring(0, str.length - 1);
  }

  return `${str}${REPLACEMENT}${id}`;
}
