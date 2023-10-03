import { useEffect, useState } from 'react';

/**
 * Returns whether the document has been hydrated by React. This will return
 * false during server rendering and during the initial client render, but on
 * the second client render onward, it will return true.
 *
 * This can be useful to decide when it's safe to do client-only things like
 * accessing window.
 */
export function useIsHydrated(): boolean {
  const [isOnClient, setIsOnClient] = useState(false);
  useEffect(() => {
    setIsOnClient(true);
  }, []);
  return isOnClient;
}
