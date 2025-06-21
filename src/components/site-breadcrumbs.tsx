'use client';

import { Breadcrumb, Breadcrumbs } from '@/ds/breadcrumbs';
import { makeHeading } from '@/utils/string';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type Item = { id: string; href?: string };

export function SiteBreadcrumbs() {
  // get the path, split into segments, remove the first ("")
  const parts = usePathname().split('/').slice(1);

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

    // if (currentPart !== undefined) {
    //   mutableList.push({ id: currentPart });
    // }

    return mutableList;
  }, [parts]);

  return (
    <Breadcrumbs key={breadcrumbs.map((b) => b.id).join('.')}>
      {breadcrumbs.map((b) => (
        <Breadcrumb key={b.id} href={b.href}>
          {makeHeading(b.id)}
        </Breadcrumb>
      ))}
    </Breadcrumbs>
  );
}
