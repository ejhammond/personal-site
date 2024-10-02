import './mdx.css';

import React from 'react';
import { FaTwitter } from 'react-icons/fa';
import Image from 'next/image';

import { MDXArticleMetadata } from '@/types/mdx-article-metadata';
import profileImage from '@/images/profile-pic.jpeg';
import { VStack } from '@/ds/v-stack';
import { HStack } from '@/ds/h-stack';
import { Link } from '@/ds/link';

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
    <article className="mdx">
      <header style={{ marginBlockEnd: '32px' }}>
        <h1>{title}</h1>
        <div>
          {parsedDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </header>
      {children}
      <Link href={editOnGitHubURL}>Edit on GitHub</Link>
      <hr style={{ marginBlock: '40px' }} />
      <footer>
        <HStack gap="md" vAlign="center">
          <Image
            src={profileImage}
            alt="EJ Hammond profile"
            width={50}
            height={50}
            style={{
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <VStack>
            <strong>EJ Hammond</strong>
            <Link
              href={`https://twitter.com/ejhammond`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FaTwitter size="0.8em" />
              {'@ejhammond'}
            </Link>
          </VStack>
        </HStack>
      </footer>
    </article>
  );
}
