'use client';

import { directoryIndex } from '@/templates/directory-index.gen';
import { makeHeading } from '@/utils/string';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { BackLink } from '@/app/back-link';
import { SiteFooter } from '@/app/site-footer';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { HStack, VStack } from '@astryxdesign/core/Stack';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

// Directory names render through makeHeading, except 'dnd' — the site
// calls it D&D everywhere (nav, descriptions), not "Dnd".
function displayName(name: string): string {
  return name === 'dnd' ? 'D&D' : makeHeading(name);
}

export function DirectoryTemplate() {
  const uriPath = usePathname();

  const directory = useMemo(() => directoryIndex.get(uriPath), [uriPath]);

  if (directory == null) {
    return null;
  }

  const isRoot = uriPath === '/';
  const title = isRoot
    ? 'Ayhota'
    : displayName(directory.path.split('/').at(-1) ?? 'Pages');
  const parentPath = uriPath.split('/').slice(0, -1).join('/') || '/';
  const subDirectories = directory.subDirectories.toSorted();

  return (
    <Layout
      height="fill"
      contentWidth={1200}
      footer={
        <LayoutFooter hasDivider padding={4}>
          <SiteFooter />
        </LayoutFooter>
      }
      content={
        <LayoutContent padding={8}>
          <VStack gap={10}>
            <VStack gap={4}>
              <Heading level={1}>{title}</Heading>
              {isRoot && (
                <Text type="supporting" color="secondary">
                  Essays, tools, and trackers by EJ Hammond.
                </Text>
              )}
              {!isRoot && (
                <HStack hAlign="start">
                  <BackLink href={parentPath} />
                </HStack>
              )}
            </VStack>
            <Grid columns={{ minWidth: 260 }} gap={2}>
              {subDirectories.map((dir) => {
                const subDirectory = directoryIndex.get(dir);
                const isPage =
                  subDirectory?.files?.some((f) => f.tags.has('page')) ?? false;
                const name = dir.split('/').at(-1) ?? dir;
                const label = displayName(name);
                const description = subDirectory?.description;
                const date = subDirectory?.date;
                return (
                  <ClickableCard key={dir} label={`Open ${label}`} href={dir}>
                    <VStack gap={0.5}>
                      <Text type="body" weight="bold">
                        {label}
                      </Text>
                      {description != null ? (
                        <Text type="body" color="secondary" maxLines={2}>
                          {description}
                        </Text>
                      ) : (
                        <Text type="body" color="secondary">
                          {isPage ? 'Page' : 'Folder'}
                        </Text>
                      )}
                      {date != null && (
                        <Text type="supporting" color="secondary">
                          {formatDate(date)}
                        </Text>
                      )}
                    </VStack>
                  </ClickableCard>
                );
              })}
            </Grid>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
