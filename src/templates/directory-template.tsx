'use client';

import { directoryIndex } from '@/templates/directory-index.gen';
import { makeHeading } from '@/utils/string';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { Icon } from '@astryxdesign/core/Icon';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { VStack } from '@astryxdesign/core/Stack';

export function DirectoryTemplate() {
  const router = useRouter();
  const uriPath = usePathname();

  const directory = useMemo(
    () => directoryIndex.get(uriPath),
    [uriPath],
  );

  if (directory == null) {
    return null;
  }

  const isRoot = uriPath === '/';
  const title = isRoot
    ? 'Pages'
    : makeHeading(directory.path.split('/').at(-1) ?? 'Pages');
  const subDirectories = directory.subDirectories.toSorted();

  return (
    <Layout
      height="fill"
      contentWidth={1200}
      content={
        <LayoutContent padding={8}>
          <VStack gap={10}>
            <VStack gap={4}>
              <Heading level={1}>{title}</Heading>
              {!isRoot && (
                <Button
                  label="Back"
                  variant="ghost"
                  icon={<Icon icon="chevronLeft" />}
                  onClick={() => router.back()}
                />
              )}
            </VStack>
            <Grid columns={{ minWidth: 260 }} gap={2}>
              {subDirectories.map((dir) => {
                const subDirectory = directoryIndex.get(dir);
                const isPage =
                  subDirectory?.files?.some((f) => f.tags.has('page')) ??
                  false;
                const name = dir.split('/').at(-1) ?? dir;
                const label = makeHeading(name);
                return (
                  <ClickableCard
                    key={dir}
                    label={`Open ${label}`}
                    href={dir}
                  >
                    <VStack gap={0.5}>
                      <Text type="body" weight="bold">
                        {label}
                      </Text>
                      <Text type="body" color="secondary">
                        {isPage ? 'Page' : 'Folder'}
                      </Text>
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
