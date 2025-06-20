#!/usr/bin/env ts-node

import path from 'path';
import fs from 'fs/promises';
import { TEMPLATES_ROOT, toFilePath, traverseDirectory } from './traverse';
import {
  DirectoryIndex,
  serializeDirectoryIndex,
} from '../src/types/directory';

const ignoredDirectories = ['/images', '__private__'];

export async function genIndexes(
  directoryIndex: DirectoryIndex,
): Promise<void> {
  const directoryIndexFile = `
/**
 * THIS FILE IS GENERATED; DO NOT EDIT BY HAND
 *
 * script: scripts/gen-index.ts
 * re-gen command: npm run gen
 */
import {
  SerializableDirectoryIndex,
  hydrateDirectoryIndex,
} from '@/types/directory';

const serializableDirectoryIndex: SerializableDirectoryIndex = ${serializeDirectoryIndex(directoryIndex)};
export const directoryIndex = hydrateDirectoryIndex(serializableDirectoryIndex);
  `;
  await fs.writeFile(
    path.resolve(TEMPLATES_ROOT, 'directory-index.gen.ts'),
    directoryIndexFile,
    { encoding: 'utf-8' },
  );
  traverseDirectory(directoryIndex, async (dir) => {
    if (ignoredDirectories.some((pattern) => dir.path.includes(pattern))) {
      return;
    }

    const apiRouteFile = dir.files.find((file) => file.tags.has('api-route'));
    const pageFile = dir.files.find((file) => file.tags.has('page'));

    // if the directory already has a page or api-route file, we won't generate
    // a directory page
    if (pageFile != null || apiRouteFile != null) {
      return;
    }

    const fileContents = `
/**
 * THIS FILE IS GENERATED; DO NOT EDIT BY HAND
 *
 * script: scripts/gen-index.ts
 * re-gen command: npm run gen
 */

import { DirectoryTemplate } from '@/templates/directory-template';

export default function Page() {
  return (
    <DirectoryTemplate />
  );
}
  `.trim();

    await fs.writeFile(
      path.join(toFilePath(dir.path), 'page.gen.tsx'),
      fileContents,
      {
        encoding: 'utf-8',
      },
    );
  });
}
