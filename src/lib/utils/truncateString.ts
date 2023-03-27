export function truncateString(str: string, maxLength: number, placeholder = "..."): string {
  if (str.length < maxLength) {
    return str;
  }

  const length = Math.min(str.length, maxLength - placeholder.length);

  if (length === str.length) {
    return str;
  }

  return str.slice(0, length) + placeholder;
}
