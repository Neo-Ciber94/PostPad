import { useEffect, useState } from "react";

export function useMediaQuery(
  mediaQuery: string,
  defaultValue: boolean = true
): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    setMatches(window.matchMedia(mediaQuery).matches);

    window.matchMedia(mediaQuery).addEventListener("change", (event) => {
      setMatches(event.matches);
    });
  }, [mediaQuery]);

  return matches;
}
