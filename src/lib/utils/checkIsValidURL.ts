// TODO: Use regex, we only require an URL that is not relative
export function checkIsValidURL(url: string): boolean {
  try {
    // This throw if is invalid or relative
    void new URL(url);
    return true;
  } catch {
    return false;
  }
}
