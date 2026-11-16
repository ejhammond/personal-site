'use client';

import { useCallback, useSyncExternalStore } from 'react';

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
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onStoreChange);
      return () => mediaQueryList.removeEventListener('change', onStoreChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
