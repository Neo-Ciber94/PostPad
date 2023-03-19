import { cookies as getCookies } from "next/headers";
import { getUserPreferredColorScheme } from "./getUserPreferredColorScheme";

/**
 * Returns a value indicating whether if the user prefers the dark mode.
 */
export function getUserPrefersDarkMode(): boolean | null {
  const cookies = getCookies();

  // We check if the cookie for the dark mode is set
  const darkModeCookie = cookies.get("dark");

  if (darkModeCookie != null) {
    return darkModeCookie.value === "true";
  }

  // Otherwise fallback to the client hints
  const preferredColorScheme = getUserPreferredColorScheme();

  // If client side hint are not supported, there is nothing to do here
  if (preferredColorScheme == null) {
    return null;
  }

  return preferredColorScheme === "dark";
}
