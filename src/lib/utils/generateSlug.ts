import { nanoid } from "nanoid";

const REPLACEMENT = "-";
const MAX_LENGTH = 40;

export function generateSlug(str: string): string {
  if (str.length === 0) {
    throw new Error("string cannot be empty");
  }

  const id = nanoid();

  str = str
    // Replace all the accented characters
    // https://stackoverflow.com/a/70288180/9307869
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^a-zA-Z0-9]/g, REPLACEMENT)

    // Remove the consecutive `-` and keep only one
    .split("")
    .filter((val, idx, items) => val !== REPLACEMENT || items[idx + 1] !== val)
    .join("");

  if (str.startsWith(REPLACEMENT)) {
    str = str.substring(1);
  }

  if (str.endsWith(REPLACEMENT)) {
    str = str.substring(0, str.length - 1);
  }

  // Ensure max length
  str = str.slice(0, MAX_LENGTH);

  return `${str}${REPLACEMENT}${id}`;
}
