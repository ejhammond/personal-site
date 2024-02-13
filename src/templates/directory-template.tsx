'use client';

import { directoryIndex } from '@/templates/directory-index.gen';
import { HStack } from '@/ds/h-stack';
import { VStack } from '@/ds/v-stack';
import { makeHeading } from '@/utils/string';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Directory } from '@/types/directory';
import { css } from '@/panda/css';

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
                key={dir}
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
  const path = usePathname();
  const pathParts = path.split('/');
  const subPaths: Array<string> = [];
  while (pathParts.length > 0) {
    subPaths.push(pathParts.join('/'));
    pathParts.pop();
  }

  const directories: ReadonlyArray<Directory | undefined> = subPaths
    .reverse()
    .map((p) => (p === '' ? '/' : p))
    .map((p) => directoryIndex.get(p));

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
              selectedDirectories={new Set(subPaths)}
            />
          ),
      )}
    </HStack>
  );
}
