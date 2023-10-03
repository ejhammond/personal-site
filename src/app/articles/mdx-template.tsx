import './mdx.css';

import { css } from '@/panda/css';
import React from 'react';
import { FaTwitter } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

import { MDXArticleMetadata } from '@/types/mdx-article-metadata';
import profileImage from '@/images/profile-pic.jpeg';

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
  articleKey,
  title,
  description,
  date,
  author,
  uriPath,
  repoPath,
  tags,
  children,
}: MDXArticleMetadata & Readonly<{ children: React.ReactNode }>) {
  const editOnGitHubURL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/${GITHUB_MAIN_BRANCH}/${repoPath}`;

  const parsedDate = new Date(date);

  return (
    <article className="mdx">
      <header className={css({ mb: 'lg' })}>
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
      <hr className={css({ my: 'xl' })} />
      <footer>
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: 'md',
          })}
        >
          <Image
            src={profileImage}
            alt="EJ Hammond profile"
            width={50}
            height={50}
            className={css({
              borderRadius: 'circle',
            })}
          />
          <div>
            <p className={css({ my: 0, display: 'flex', gap: 'sm' })}>
              <strong className={css({ mr: 1 })}>EJ Hammond</strong>
              <Link
                href={`https://twitter.com/ejhammond`}
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'xs',
                })}
              >
                <FaTwitter size="0.8em" />
                {'@ejhammond'}
              </Link>
            </p>
            <p className={css({ my: 0 })}>
              is a Boston-based min-maxer and web developer.
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}
