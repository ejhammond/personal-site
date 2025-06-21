#!/usr/bin/env ts-node

import { Directory, FileTag, File, DirectoryIndex } from '@/types/directory';
import fs from 'fs/promises';
import path from 'path';

export const REPO_ROOT = path.resolve('.');
export const SRC_ROOT = path.join(REPO_ROOT, '/src');
export const TEMPLATES_ROOT = path.join(SRC_ROOT, '/templates');
export const APP_ROOT = path.join(SRC_ROOT, '/app');
export const ARTICLES_ROOT = path.join(APP_ROOT, '/articles');

const PAGE_FILENAMES = new Set(['page.tsx', 'page.gen.tsx']);
const API_ROUTE_FILENAME = 'route.ts';
const LAYOUT_FILENAME = 'layout.tsx';
export const ARTICLE_CONTENT_FILENAME = 'content.mdx';
export const ARTICLE_METADATA_FILENAME = 'metadata.json';
const GENERATED_FILE_EXTENSIONS = ['.gen.ts', '.gen.tsx'];

export type SitePath = string;
export type FilePath = string;

export function toSitePath(filePath: FilePath): SitePath {
  return `/${path.relative(APP_ROOT, filePath)}`;
}

export function toFilePath(sitePath: SitePath): FilePath {
  return path.join(APP_ROOT, sitePath);
}

const ignoredPatterns = ['/__private__', '/auth'];

async function readDirectory(sitePath: SitePath): Promise<Directory> {
  const filePath = toFilePath(sitePath);
  const entries = await fs.readdir(filePath, { withFileTypes: true });
  const subDirectories = [];
  const files: Array<File> = [];

  for (const entry of entries) {
    const fullPath = path.resolve(filePath, entry.name);
    const tags = new Set<FileTag>();

    if (ignoredPatterns.some((p) => fullPath.includes(p))) {
      continue;
    }

    if (entry.isDirectory()) {
      subDirectories.push(toSitePath(fullPath));
      continue;
    }

    if (PAGE_FILENAMES.has(entry.name)) {
      tags.add('page');
    }

    if (entry.name === API_ROUTE_FILENAME) {
      tags.add('api-route');
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
      path: toSitePath(fullPath),
      tags,
    });
  }

  return {
    path: sitePath,
    subDirectories,
    files,
  };
}

export async function readFiles(): Promise<DirectoryIndex> {
  const index = new Map<SitePath, Directory>();
  const stack: Array<SitePath> = [toSitePath(APP_ROOT)];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current == null) {
      continue;
    }

    const directory = await readDirectory(current);

    index.set(current, directory);

    stack.push(...directory.subDirectories);
  }

  return index;
}

/**
 * Executes the given callback on directory and all recursive subdirectories in
 * parallel.
 */
export async function traverseDirectory(
  index: DirectoryIndex,
  callback: (dir: Directory) => Promise<void>,
) {
  await Promise.all(Array.from(index.values()).map((d) => callback(d)));
}
