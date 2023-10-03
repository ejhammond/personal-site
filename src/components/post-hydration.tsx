'use client';

import { useIsHydrated } from '@/utils/use-is-on-client';
import React from 'react';

/**
 * Returns the given children only after the document has been hydrated by React
 * During server rendering and during the initial client render (aka pre-
 * hydration) it will render the given fallback.
 *
 * This can be useful if a component cannot possibly render reliably on the
 * server (e.g. it needs access to browser apis).
 *
 * Regarding the fallback, keep in mind that the fallback will be visible for
 * such a short time that rendering nothing may be preferable to rendering a
 * loading state.
 */
export function PostHydration({
  children,
  fallback,
}: Readonly<{ children: React.ReactNode; fallback: React.ReactNode }>) {
  const isHydrated = useIsHydrated();

  return isHydrated ? <>{children}</> : <>{fallback}</>;
}
