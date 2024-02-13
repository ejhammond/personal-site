'use client';

import { css } from '@/panda/css';
import { makeHeading } from '@/utils/string';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';

function Slash() {
  return (
    <span aria-hidden className={css({ px: 'sm' })}>
      /
    </span>
  );
}

export function Breadcrumbs({
  className,
}: Readonly<{ className?: string | undefined }>) {
  const parts = useSelectedLayoutSegments();
  const previousParts = parts.slice(0, -1);
  const currentPart = parts.slice(-1)[0];

  const breadcrumbs =
    currentPart !== undefined
      ? [
          <li key="home">
            <Link href="/">Home</Link>
          </li>,
        ]
      : [<li key="home">Home</li>];

  for (let i = 0; i < previousParts.length; ++i) {
    const part = previousParts[i];
    const url = '/' + previousParts.slice(0, i + 1).join('/');

    breadcrumbs.push(<Slash key={`slash-${part}`} />);

    breadcrumbs.push(
      <li key={part}>
        <Link href={url}>{makeHeading(part)}</Link>
      </li>,
    );
  }

  if (currentPart !== undefined) {
    breadcrumbs.push(<Slash key={`slash-${currentPart}`} />);

    breadcrumbs.push(<li key={currentPart}>{makeHeading(currentPart)}</li>);
  }

  return (
    <nav className={className}>
      <ul className={css({ display: 'flex' })}>{breadcrumbs}</ul>
    </nav>
  );
}
