'use client';

import { css } from '@/panda/css';
import { makeHeading } from '@/utils/string';
import {
  Breadcrumbs as SpectrumBreadcrumbs,
  Item,
} from '@adobe/react-spectrum';
import { useSelectedLayoutSegments } from 'next/navigation';

export function Breadcrumbs() {
  const parts = useSelectedLayoutSegments();
  const previousParts = parts.slice(0, -1);
  const currentPart = parts.slice(-1)[0];

  const breadcrumbs =
    currentPart !== undefined
      ? [
          <Item key="home" href="/">
            Home
          </Item>,
        ]
      : [<Item key="home">Home</Item>];

  for (let i = 0; i < previousParts.length; ++i) {
    const part = previousParts[i];
    const url = '/' + previousParts.slice(0, i + 1).join('/');

    breadcrumbs.push(
      <Item key={part} href={url}>
        {makeHeading(part)}
      </Item>,
    );
  }

  if (currentPart !== undefined) {
    breadcrumbs.push(<Item key={currentPart}>{makeHeading(currentPart)}</Item>);
  }

  return <SpectrumBreadcrumbs>{breadcrumbs}</SpectrumBreadcrumbs>;
}
