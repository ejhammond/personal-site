'use client';

import { VStack } from '@/ds/v-stack';
import { makeHeading } from '@/utils/string';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = Readonly<{
  subDirectories: ReadonlyArray<string>;
}>;

export function DirectoryTemplate({ subDirectories }: Props) {
  const pathname = usePathname();

  const uriPrefix = pathname === '/' ? '' : pathname;

  return (
    <VStack>
      {subDirectories.map((dir) => (
        <Link key={dir} href={`${uriPrefix}/${dir}`}>
          {makeHeading(dir)}
        </Link>
      ))}
    </VStack>
  );
}
