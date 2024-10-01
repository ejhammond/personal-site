'use client';

import { Breadcrumbs } from '@/ds/breadcrumbs';
import { Link } from '@/ds/link';
import { makeHeading } from '@/utils/string';
import { useSelectedLayoutSegments } from 'next/navigation';
import { useMemo } from 'react';
import { Breadcrumb } from 'react-aria-components';

type Item = { id: string; href?: string };

export function SiteBreadcrumbs() {
  const parts = useSelectedLayoutSegments();
  const breadcrumbs = useMemo(() => {
    const previousParts = parts.slice(0, -1);
    const currentPart = parts.slice(-1)[0];

    const mutableList: Item[] =
      currentPart !== undefined
        ? [{ id: 'home', href: '/' }]
        : [{ id: 'home' }];

    for (let i = 0; i < previousParts.length; ++i) {
      const part = previousParts[i];
      const url = '/' + previousParts.slice(0, i + 1).join('/');

      mutableList.push({ id: part, href: url });
    }

    if (currentPart !== undefined) {
      mutableList.push({ id: currentPart });
    }

    return mutableList;
  }, [parts]);

  return (
    <Breadcrumbs key={breadcrumbs.join('.')} items={breadcrumbs}>
      {(item) => (
        <Breadcrumb>
          <Link href={item.href}>{makeHeading(item.id)}</Link>
        </Breadcrumb>
      )}
    </Breadcrumbs>
  );
}
