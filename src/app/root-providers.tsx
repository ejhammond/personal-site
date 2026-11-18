'use client';

import NextLink from 'next/link';
import { LinkProvider } from '@astryxdesign/core/Link';
import { useRouter } from 'next/navigation';
import { RouterProvider } from 'react-aria-components';

export function RootProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <LinkProvider component={NextLink}>
      <RouterProvider navigate={router.push}>{children}</RouterProvider>
    </LinkProvider>
  );
}
