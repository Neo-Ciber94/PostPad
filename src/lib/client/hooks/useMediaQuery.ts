import { useEffect, useState } from "react";

export function useMediaQuery(mediaQuery: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(mediaQuery).matches;
  });

  useEffect(() => {
    setMatches(window.matchMedia(mediaQuery).matches);

    window.matchMedia(mediaQuery).addEventListener("change", (event) => {
      setMatches(event.matches);
    });
  }, []);

  return matches;
}
