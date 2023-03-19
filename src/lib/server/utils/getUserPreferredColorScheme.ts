import { headers as getHeaders } from "next/headers";
import { z } from "zod";

const preferredColorScheme = z.enum(["dark", "light"]);

export type PreferredColorScheme = z.infer<typeof preferredColorScheme>;

// https://web.dev/user-preference-media-features-headers/
export function getUserPreferredColorScheme(): PreferredColorScheme | null {
  const headers = getHeaders();
  const value = headers.get("sec-ch-prefers-color-scheme");

  if (value == null) {
    return null;
  }

  const result = preferredColorScheme.safeParse(value);

  return result.success ? result.data : null;
}
