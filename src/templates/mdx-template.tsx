import './mdx.css';

import React from 'react';

import { MDXArticleMetadata } from '@/types/mdx-article-metadata';
import profileImage from '@/images/profile-pic.jpeg';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Divider } from '@astryxdesign/core/Divider';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';

const GITHUB_USERNAME = 'ejhammond';
const GITHUB_REPO_NAME = 'personal-site';
const GITHUB_MAIN_BRANCH = 'main';

/**
 * This "layout" is different from the standard Next layouts/templates. Rather
 * than having Next implicitly add a layout to our MDX content, we run a
 * build-time script to generate pages which wraps each page in this layout
 * "manually".
 *
 * The alternative is to use Next's dynamic route segments
 */
export function MDXTemplate({
  title,
  date,
  repoPath,
  children,
}: MDXArticleMetadata & Readonly<{ children: React.ReactNode }>) {
  const editOnGitHubURL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/${GITHUB_MAIN_BRANCH}${repoPath}`;

  const parsedDate = new Date(date);

  return (
    <Layout
      height="auto"
      contentWidth={960}
      content={
        <LayoutContent isScrollable={false} padding={8}>
          <VStack gap={8}>
            <VStack gap={2}>
              <Heading level={1}>{title}</Heading>
              <Text type="supporting" color="secondary">
                {parsedDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </VStack>
            <article className="mdx">{children}</article>
            <VStack gap={4}>
              <Link href={editOnGitHubURL}>Edit on GitHub</Link>
              <Divider />
              <HStack gap={3} vAlign="center">
                <Avatar
                  src={profileImage.src}
                  name="EJ Hammond"
                  alt="EJ Hammond profile"
                  size={48}
                />
                <VStack gap={0}>
                  <Text weight="semibold">EJ Hammond</Text>
                  <Link href={`https://twitter.com/ejhammond`}>@ejhammond</Link>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
