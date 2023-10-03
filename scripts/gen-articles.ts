#!/usr/bin/env ts-node

import fs from 'fs/promises';
import path from 'path';
import graymatter from 'gray-matter';
import { MDXArticleMetadata } from '@/types/mdx-article-metadata';

const REPO_ROOT = path.resolve('.');
const APP_ROOT = path.join(REPO_ROOT, '/src/app');
const ARTICLES_ROOT = path.join(APP_ROOT, '/articles');

const CONTENT_FILENAME = 'content.mdx';
const PAGE_FILENAME = 'page.tsx';
const METADATA_FILENAME = 'metadata.json';

const articleStats: Record<string, MDXArticleMetadata> = {};

async function readDirectory(dir: string): Promise<
  Readonly<{
    subDirectories: ReadonlyArray<string>;
    article: {
      contentFile: string;
      metadataFile: string;
      pageFile: string | null;
    } | null;
    otherFiles: ReadonlyArray<string>;
  }>
> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const subDirectories = [];
  const otherFiles = [];
  let contentFile = null;
  let metadataFile = null;
  let pageFile = null;

  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      subDirectories.push(fullPath);
    } else if (entry.name === CONTENT_FILENAME) {
      contentFile = fullPath;
    } else if (entry.name === METADATA_FILENAME) {
      metadataFile = fullPath;
    } else if (entry.name === PAGE_FILENAME) {
      pageFile = fullPath;
    } else {
      otherFiles.push(fullPath);
    }
  }

  let article = null;
  if ([contentFile, metadataFile, pageFile].some((f) => f != null)) {
    // at least one file is defined, so we have an article

    if (contentFile == null || metadataFile == null) {
      throw new Error(
        `Malformed article found in ${dir}. Articles must have both a content.mdx and a metadata.json`,
      );
    }

    article = {
      contentFile,
      metadataFile,
      pageFile,
    };
  }

  return {
    subDirectories,
    otherFiles,
    article,
  };
}

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
      .join(metadataFile, '..', CONTENT_FILENAME)
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

import { MDXTemplate } from '@/app/articles/mdx-template';
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

  await fs.writeFile(path.resolve(dir, 'page.tsx'), fileContents, {
    encoding: 'utf-8',
  });

  console.log('\x1b[32m%s\x1b[0m', `✔️ ${getArticleDisplayName(contentFile)}`);
}

async function processDirectory(dir: string): Promise<void> {
  const { subDirectories, article } = await readDirectory(dir);

  // kick off recursive work without blocking
  const processSubDirectoryPromises = subDirectories.map((dir) =>
    processDirectory(dir),
  );

  if (article != null) {
    const { contentFile, metadataFile, pageFile } = article;

    // clean
    if (pageFile != null) {
      await fs.rm(pageFile);
    }

    // gen
    await genPage(contentFile, metadataFile);
  }

  // wait for recursive work to finish
  await Promise.all(processSubDirectoryPromises);
}

async function main() {
  console.log('\x1b[36m%s\x1b[0m', `Generating pages from MDX files\n`);

  processDirectory(ARTICLES_ROOT);
}

main();
