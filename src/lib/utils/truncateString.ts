export function truncateString(
  str: string,
  maxLength: number,
  placeholder = "..."
): string {
  if (str.length < maxLength) {
    return str;
  }

  return str.substring(0, maxLength - placeholder.length) + placeholder;
}
