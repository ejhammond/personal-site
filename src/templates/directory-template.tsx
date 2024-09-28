'use client';

import { directoryIndex } from '@/templates/directory-index.gen';
import { HStack } from '@/ds/h-stack';
import { VStack } from '@/ds/v-stack';
import { makeHeading } from '@/utils/string';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Directory } from '@/types/directory';
import { useMemo } from 'react';
import { FaFolder, FaFile } from 'react-icons/fa';

function DirListing({
  selectedDirectories,
  directories,
  className,
  style,
}: Readonly<{
  selectedDirectories: ReadonlySet<string>;
  directories: ReadonlyArray<string>;
  className?: string;
  style?: React.CSSProperties;
}>) {
  const sortedDirectories = useMemo(() => directories.toSorted(), directories);
  return (
    <VStack className={className} style={style} gap="sm">
      {sortedDirectories.map((dir) => {
        const directory = directoryIndex.get(dir);
        const isPage = directory?.files?.some((f) => f.tags.has('page'));
        const parts = dir.split('/');
        const name = parts.at(-1);
        const label = name != null ? makeHeading(name) : null;
        const isSelected = selectedDirectories.has(dir);
        const labelContent = (
          <HStack vAlign="center" gap="md">
            {isPage ? <FaFile /> : <FaFolder />}{' '}
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {label}
            </span>
          </HStack>
        );

        return (
          <div
            key={dir}
            style={{
              boxSizing: 'border-box',
              paddingInline: '8px',
              backgroundColor: isSelected ? 'accent' : 'inherit',
              color: 'text-primary',
              fontWeight: isSelected ? 'bold' : 'inherit',
              outline: isSelected ? '1px solid var(--accent-color)' : 'none',
              // '&:hover': {
              //   outline: '1px solid {colors.accent}',
              // },
            }}
          >
            {selectedDirectories.has(dir) ? (
              labelContent
            ) : (
              <Link
                href={dir}
                style={{
                  textDecoration: 'none',
                }}
              >
                {labelContent}
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
    <HStack gap="lg" style={{ containerType: 'inline-size' }}>
      {directories[3] != null && (
        <DirListing
          directories={directories[3].subDirectories}
          selectedDirectories={selectedDirectories}
          style={{
            display: 'flex',
            minWidth: 0,
            flexGrow: 1,
          }}
        />
      )}
      {directories[2] != null && (
        <DirListing
          directories={directories[2].subDirectories}
          selectedDirectories={selectedDirectories}
          style={{
            display: 'flex',
            minWidth: 0,
            flexGrow: 1,
          }}
        />
      )}
      {directories[1] != null && (
        <DirListing
          directories={directories[1].subDirectories}
          selectedDirectories={selectedDirectories}
          style={{
            display: 'flex',
            minWidth: 0,
            flexGrow: 1,
          }}
        />
      )}
      {directories[0] != null && (
        <DirListing
          key={directories[0].path}
          directories={directories[0].subDirectories}
          selectedDirectories={selectedDirectories}
          style={{
            minWidth: 0,
            flexGrow: 1,
          }}
        />
      )}
    </HStack>
  );
}
