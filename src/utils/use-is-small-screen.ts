'use client';

import { useMediaQuery } from './use-media-query';

export function useIsSmallScreen() {
  return useMediaQuery('(width <= 768px)');
}
