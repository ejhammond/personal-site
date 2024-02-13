#!/usr/bin/env ts-node

import path from 'path';
import fs from 'fs/promises';
import { Directory } from './gen';

export async function genIndexes(directory: Directory): Promise<void> {
  const pageFile = directory.files.find((file) => file.tags.has('page'));

  // if this directory has a page defined, then we don't need to create a routing page here
  if (pageFile != null) {
    return;
  }

  const subDirectories = directory.subDirectories.map((dir) =>
    dir.replace(`${directory.path}/`, ''),
  );

  if (subDirectories.length === 0) {
    return;
  }

  const fileContents = `
/**
 * THIS FILE IS GENERATED; DO NOT EDIT BY HAND
 *
 * script: scripts/gen-directory-pages.ts
 * re-gen command: npm run gen
 */

import { DirectoryTemplate } from '@/templates/directory-template';

const subDirectories = ${JSON.stringify(subDirectories, null, 2)};

export default function Page() {
  return (
    <DirectoryTemplate subDirectories={subDirectories} />
  );
}
  `.trim();

  await fs.writeFile(
    path.resolve(directory.path, 'index.gen.tsx'),
    fileContents,
    {
      encoding: 'utf-8',
    },
  );
}
