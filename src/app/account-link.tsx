'use client';

import { Icon } from '@astryxdesign/core/Icon';
import { MdAccountCircle, MdOutlineAccountCircle } from 'react-icons/md';
import Link from 'next/link';

/**
 * The account icon in the top nav. A client component because Astryx's
 * <Icon> takes the glyph as a component type, and component types cannot be
 * passed from a Server Component (the root layout) to a Client Component.
 * Only the boolean crosses the server/client boundary.
 */
export function AccountLink({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Link
      href={isLoggedIn ? '/auth/profile' : '/auth/login'}
      aria-label={isLoggedIn ? 'Profile' : 'Log in'}
    >
      <Icon
        icon={isLoggedIn ? MdAccountCircle : MdOutlineAccountCircle}
        size="lg"
      />
    </Link>
  );
}
