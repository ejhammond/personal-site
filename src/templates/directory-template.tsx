'use client';

import { directoryIndex } from '@/templates/directory-index.gen';
import { HStack } from '@/ds/h-stack';
import { VStack } from '@/ds/v-stack';
import { makeHeading } from '@/utils/string';
import { usePathname } from 'next/navigation';
import { Directory } from '@/types/directory';
import { useMemo } from 'react';

import './directory-template.css';
import DirectoryListing from '@/ds/directory-listing';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';

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
  const sortedDirectories = useMemo(
    () => directories.toSorted(),
    [directories],
  );
  return (
    <VStack className={className} style={style} gap="sm">
      {sortedDirectories.map((dir) => {
        const directory = directoryIndex.get(dir);
        const isPage = directory?.files?.some((f) => f.tags.has('page'));
        const parts = dir.split('/');
        const name = parts.at(-1);
        const label = name != null ? makeHeading(name) : '<missing-name>';
        const isSelected = selectedDirectories.has(dir);

        return (
          <DirectoryListing
            key={dir}
            label={label}
            isSelected={isSelected}
            href={selectedDirectories.has(dir) ? null : dir}
            type={isPage ? 'file' : 'folder'}
          />
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
    <PageLayout type="table" header={<PageLayoutHeader title="Pages" />}>
      <HStack gap="lg" style={{ containerType: 'inline-size' }}>
        {directories[3] != null && (
          <DirListing
            className="dir-listing dir-listing-layer-4"
            directories={directories[3].subDirectories}
            selectedDirectories={selectedDirectories}
          />
        )}
        {directories[2] != null && (
          <DirListing
            className="dir-listing dir-listing-layer-3"
            directories={directories[2].subDirectories}
            selectedDirectories={selectedDirectories}
          />
        )}
        {directories[1] != null && (
          <DirListing
            className="dir-listing dir-listing-layer-2"
            directories={directories[1].subDirectories}
            selectedDirectories={selectedDirectories}
          />
        )}
        {directories[0] != null && (
          <DirListing
            className="dir-listing dir-listing-layer-1"
            key={directories[0].path}
            directories={directories[0].subDirectories}
            selectedDirectories={selectedDirectories}
          />
        )}
      </HStack>
    </PageLayout>
  );
}
