import { useEffect, useState } from 'react';

/**
 * Monitors the given media query and returns whether it matches
 *
 * When this renders on the server, we won't have access to the browser to
 * actually check the value, so we'll just return false for the server render
 * and initial client render. If that's an issue, consider rendering a fallback
 * (or nothing) for the server render and initial client render using the
 * PostHydration component.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    // immediately set matches based on the current result
    setMatches(mediaQueryList.matches);

    // listen for changes to the result
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  return matches;
}
