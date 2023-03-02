import { nanoid } from "nanoid";

export function generateSlug(title: string): string {
  const id = nanoid();
  title = title.replaceAll(/[^a-zA-Z0-9]*/g, "-");
  return `${title}-${id}`;
}
