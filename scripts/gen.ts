#!/usr/bin/env ts-node

import fs from 'fs/promises';
import path from 'path';
import { genArticles } from './gen-articles';
import { genDirectoryPages } from './gen-directory-pages';
import { genClean } from './gen-clean';
import { readTimer, startTimer } from './timer';

export const REPO_ROOT = path.resolve('.');
export const APP_ROOT = path.join(REPO_ROOT, '/src/app');
export const ARTICLES_ROOT = path.join(APP_ROOT, '/articles');

const PAGE_FILENAMES = new Set(['page.tsx', 'page.gen.tsx']);
const LAYOUT_FILENAME = 'layout.tsx';
export const ARTICLE_CONTENT_FILENAME = 'content.mdx';
export const ARTICLE_METADATA_FILENAME = 'metadata.json';
const GENERATED_FILE_EXTENSIONS = ['.gen.ts', '.gen.tsx'];

type FileTag =
  | 'article-page'
  | 'article-content'
  | 'article-meta'
  | 'page'
  | 'layout'
  | 'generated';
export type File = Readonly<{
  path: string;
  tags: ReadonlySet<FileTag>;
}>;
export type Directory = Readonly<{
  path: string;
  files: ReadonlyArray<File>;
  subDirectories: ReadonlyArray<string>;
}>;

async function readDirectory(dir: string): Promise<Directory> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const subDirectories = [];
  const files: Array<File> = [];

  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    const tags = new Set<FileTag>();
    if (entry.isDirectory()) {
      subDirectories.push(fullPath);
      continue;
    }

    if (PAGE_FILENAMES.has(entry.name)) {
      tags.add('page');
    }

    if (entry.name === LAYOUT_FILENAME) {
      tags.add('layout');
    }

    if (entry.name === ARTICLE_CONTENT_FILENAME) {
      tags.add('article-content');
    }

    if (entry.name === ARTICLE_METADATA_FILENAME) {
      tags.add('article-meta');
    }

    if (
      GENERATED_FILE_EXTENSIONS.some((extension) =>
        entry.name.endsWith(extension),
      )
    ) {
      tags.add('generated');
    }

    files.push({
      path: fullPath,
      tags,
    });
  }

  return {
    path: dir,
    subDirectories,
    files,
  };
}

async function processDirectory(dir: string): Promise<void> {
  const directory = await readDirectory(dir);

  // this will kick off the recursive work without blocking the work in this dir
  const processSubDirectoriesPromises = directory.subDirectories.map((dir) =>
    processDirectory(dir),
  );

  // remove any generated files in the directory
  await genClean(directory);
  // gen page files for our mdx articles
  await genArticles(directory);
  // gen "directory" pages for any non-page path
  await genDirectoryPages(directory);

  // wait for subDirectory work to finish
  // this ensures that the script won't exit until all work is done
  await Promise.all(processSubDirectoriesPromises);
}

async function main() {
  startTimer();
  console.log('\x1b[36m%s\x1b[0m', `Generating pages...\n`);

  await processDirectory(APP_ROOT);
  const elapsed = readTimer();
  console.log(
    '\x1b[36m%s\x1b[0m',
    `Finished generating pages (${elapsed}ms)\n`,
  );
}

main();
