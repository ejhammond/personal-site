'use client';

import { directoryIndex } from '@/templates/directory-index.gen';
import { HStack } from '@/ds/h-stack';
import { VStack } from '@/ds/v-stack';
import { makeHeading } from '@/utils/string';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Directory } from '@/types/directory';
import { css } from '@/panda/css';
import { useMemo } from 'react';

function DirListing({
  selectedDirectories,
  directories,
}: Readonly<{
  selectedDirectories: ReadonlySet<string>;
  directories: ReadonlyArray<string>;
}>) {
  return (
    <VStack className={css({ minWidth: 150, maxWidth: 300 })}>
      {directories.map((dir) => {
        const parts = dir.split('/');
        const name = parts.at(-1);
        const label = name != null ? makeHeading(name) : null;
        const isSelected = selectedDirectories.has(dir);
        return (
          <div
            key={dir}
            className={css({
              boxSizing: 'border-box',
              px: 'sm',
              backgroundColor: isSelected ? 'accent' : 'inherit',
              color: 'text-primary',
              fontWeight: isSelected ? 'bold' : 'inherit',
              outline: isSelected ? '1px solid {colors.accent}' : 'none',
              mb: 'sm',
              '&:hover': {
                outline: '1px solid {colors.accent}',
              },
            })}
          >
            {selectedDirectories.has(dir) ? (
              label
            ) : (
              <Link
                href={dir}
                className={css({
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textDecoration: 'none',
                })}
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </VStack>
  );
}

export function DirectoryTemplate() {
  const uriPath = usePathname();

  const directories = useMemo<ReadonlyArray<Directory>>(() => {
    if (uriPath === '/') {
      const directory = directoryIndex.get('/');
      return directory != null ? [directory] : [];
    }

    const pathParts = uriPath.split('/');

    const subPaths: Array<string> = [];
    while (pathParts.length > 0) {
      if (pathParts.length === 1) {
        subPaths.push('/');
      } else {
        subPaths.push(pathParts.join('/'));
      }
      pathParts.pop();
    }

    const nonNullDirectories = [];
    for (const subPath of subPaths.reverse()) {
      const directory = directoryIndex.get(subPath);
      if (directory != null) {
        nonNullDirectories.push(directory);
      }
    }
    return nonNullDirectories;
  }, [uriPath]);

  if (directories.length == 0) {
    return null;
  }

  return (
    <HStack gap="lg">
      {directories.map(
        (directory) =>
          directory != null && (
            <DirListing
              key={directory.path}
              directories={directory.subDirectories}
              selectedDirectories={new Set(directories.map((d) => d.path))}
            />
          ),
      )}
    </HStack>
  );
}
