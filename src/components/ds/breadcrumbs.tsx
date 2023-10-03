'use client';

import { css } from '@/panda/css';
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
          <li key="ayhota">
            <Link href="/">Ayhota</Link>
          </li>,
        ]
      : [];

  for (let i = 0; i < previousParts.length; ++i) {
    const part = previousParts[i];
    const url = '/' + previousParts.slice(0, i + 1).join('/');

    breadcrumbs.push(<Slash key={`slash-${part}`} />);

    breadcrumbs.push(
      <li key={part}>
        <Link href={url}>{part}</Link>
      </li>,
    );
  }

  if (currentPart !== undefined) {
    breadcrumbs.push(<Slash key={`slash-${currentPart}`} />);

    breadcrumbs.push(<li key={currentPart}>{currentPart}</li>);
  }

  return (
    <nav className={className}>
      <ul className={css({ display: 'flex' })}>{breadcrumbs}</ul>
    </nav>
  );
}
