import { useEffect, useState } from "react";

export function useMediaQuery(mediaQuery: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    setMatches(window.matchMedia(mediaQuery).matches);

    window.matchMedia(mediaQuery).addEventListener("change", (event) => {
      setMatches(event.matches);
    });
  }, [mediaQuery]);

  return matches;
}
