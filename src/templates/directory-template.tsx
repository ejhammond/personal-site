'use client';

import { directoryIndex } from '@/templates/directory-index.gen';
import { HStack } from '@/ds/h-stack';
import { VStack } from '@/ds/v-stack';
import { makeHeading } from '@/utils/string';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Directory } from '@/types/directory';
import { css, cx } from '@/panda/css';
import { useMemo } from 'react';

function DirListing({
  selectedDirectories,
  directories,
  className,
}: Readonly<{
  selectedDirectories: ReadonlySet<string>;
  directories: ReadonlyArray<string>;
  className?: string;
}>) {
  const sortedDirectories = useMemo(() => directories.toSorted(), directories);
  return (
    <VStack className={className} gap="sm">
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

  /**
   * List of directories with the current directory first
   */
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
    for (const subPath of subPaths) {
      const directory = directoryIndex.get(subPath);
      if (directory != null) {
        nonNullDirectories.push(directory);
      }
    }

    return nonNullDirectories;
  }, [uriPath]);

  const selectedDirectories = useMemo(() => {
    return new Set(directories.map((d) => d.path));
  }, [directories]);

  if (directories.length == 0) {
    return null;
  }

  return (
    <HStack gap="lg" className={css({ containerType: 'inline-size' })}>
      {directories[3] != null && (
        <DirListing
          key={directories[3].path}
          directories={directories[3].subDirectories}
          selectedDirectories={selectedDirectories}
          className={css({
            display: {
              base: 'none',
              '@/800': 'flex',
            },
            flexGrow: 1,
            flexBasis: 1 / 4,
          })}
        />
      )}
      {directories[2] != null && (
        <DirListing
          key={directories[2].path}
          directories={directories[2].subDirectories}
          selectedDirectories={selectedDirectories}
          className={css({
            display: {
              base: 'none',
              '@/600': 'flex',
            },
            flexGrow: 1,
            flexBasis: {
              base: 1 / 3,
              '@/800': 1 / 4,
            },
          })}
        />
      )}
      {directories[1] != null && (
        <DirListing
          key={directories[1].path}
          directories={directories[1].subDirectories}
          selectedDirectories={selectedDirectories}
          className={css({
            display: {
              base: 'none',
              '@/400': 'flex',
            },
            flexGrow: 1,
            flexBasis: {
              base: 1 / 2,
              '@/600': 1 / 3,
              '@/800': 1 / 4,
            },
          })}
        />
      )}
      {directories[0] != null && (
        <DirListing
          key={directories[0].path}
          directories={directories[0].subDirectories}
          selectedDirectories={selectedDirectories}
          className={css({
            flexGrow: 1,
            flexBasis: {
              base: 1,
              '@/400': 1 / 2,
              '@/600': 1 / 3,
              '@/800': 1 / 4,
            },
          })}
        />
      )}
    </HStack>
  );
}
