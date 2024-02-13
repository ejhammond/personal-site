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
  isCurrentDirectory,
}: Readonly<{
  selectedDirectories: ReadonlySet<string>;
  directories: ReadonlyArray<string>;
  isCurrentDirectory: boolean;
}>) {
  const sortedDirectories = useMemo(() => directories.toSorted(), directories);
  return (
    <VStack
      className={css({
        flexWrap: 'wrap',
        flexBasis: 300,
        minWidth: 150,
        maxWidth: 300,
        display: {
          // always show the current directory
          base: isCurrentDirectory ? 'block' : 'block',
          // start showing the other directories at 600+px
          '@/600': 'block',
        },
      })}
    >
      {sortedDirectories.map((dir) => {
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
    // show max of 3 layers
    return nonNullDirectories.slice(-3);
  }, [uriPath]);

  if (directories.length == 0) {
    return null;
  }

  return (
    <HStack gap="lg" className={css({ containerType: 'size' })}>
      {directories.map((directory, index) => (
        <DirListing
          key={directory.path}
          directories={directory.subDirectories}
          selectedDirectories={new Set(directories.map((d) => d.path))}
          isCurrentDirectory={index === directories.length - 1}
        />
      ))}
    </HStack>
  );
}
