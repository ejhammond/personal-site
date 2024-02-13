#!/usr/bin/env ts-node

import fs from 'fs/promises';
import path from 'path';
import { MDXArticleMetadata } from '@/types/mdx-article-metadata';
import {
  APP_ROOT,
  ARTICLES_ROOT,
  ARTICLE_CONTENT_FILENAME,
  Directory,
  REPO_ROOT,
} from './gen';

function getArticleDisplayName(contentOrMetadataFile: string): string {
  const p = path.parse(contentOrMetadataFile);
  return p.dir.replace(ARTICLES_ROOT, '');
}

async function getMetadata(metadataFile: string): Promise<MDXArticleMetadata> {
  const pagePath = path.parse(metadataFile);
  const pageRoot = pagePath.dir;

  const metadataFileContent = await fs.readFile(metadataFile, {
    encoding: 'utf-8',
  });

  const data = JSON.parse(metadataFileContent);

  const assertExists = (key: string) => {
    if (typeof data[key] !== 'string') {
      throw new Error(
        `Frontmatter error: ${getArticleDisplayName(
          metadataFile,
        )} is missing metadata: "${key}"`,
      );
    }
    return data[key];
  };

  const title = assertExists('title');
  const description = assertExists('description');
  const date = assertExists('date');

  if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
    throw new Error(
      `Frontmatter error: ${getArticleDisplayName(
        metadataFile,
      )} date must be in format YYYY-MM-DD`,
    );
  }

  // assume that I wrote the article if we don't have an explicit author
  const author = typeof data.author === 'string' ? data.author : 'EJ Hammond';
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    // the key is just the name of the parent folder
    articleKey: pageRoot
      .replace(path.resolve(pageRoot, '..'), '')
      .replace(/^\//, ''),
    title,
    description,
    author,
    date,
    tags,
    repoPath: path
      .join(metadataFile, '..', ARTICLE_CONTENT_FILENAME)
      .replace(REPO_ROOT, ''),
    uriPath: pageRoot.replace(APP_ROOT, ''),
  };
}

async function genPage(
  contentFile: string,
  metadataFile: string,
): Promise<void> {
  const metadata = await getMetadata(metadataFile);

  const p = path.parse(contentFile);
  const dir = p.dir;

  const fileContents = `
/**
 * THIS FILE IS GENERATED; DO NOT EDIT BY HAND
 *
 * script: scripts/gen-articles.ts
 * re-gen command: npm run gen
 */

import { MDXTemplate } from '@/templates/mdx-template';
import Content from './${p.name}${p.ext}';

const meta = ${JSON.stringify(metadata, null, 2)};

export default function Page() {
  return (
    <MDXTemplate {...meta}>
      <Content />
    </MDXTemplate>
  );
}
  `.trim();

  await fs.writeFile(path.resolve(dir, 'page.gen.tsx'), fileContents, {
    encoding: 'utf-8',
  });
}

export async function genArticles(directory: Directory): Promise<void> {
  const contentFile = directory.files.find((file) =>
    file.tags.has('article-content'),
  );

  if (contentFile == null) {
    return;
  }

  const metadataFile = directory.files.find((file) =>
    file.tags.has('article-meta'),
  );

  if (metadataFile == null) {
    throw new Error(
      'Articles must have a metadata.json file in the directory.',
    );
  }

  // gen
  await genPage(contentFile.path, metadataFile.path);
}
