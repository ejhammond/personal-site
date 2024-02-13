#!/usr/bin/env ts-node

import util from 'util';
import { genClean } from './gen-clean';
import { genArticles } from './gen-articles';
import { genIndexes } from './gen-indexes';
import { readTimer, startTimer } from './timer';
import { readFiles } from './traverse';

async function genFiles(): Promise<void> {
  // gen page files for our mdx articles
  await genArticles(await readFiles());
  // gen "index" pages for any non-page path
  await genIndexes(await readFiles());
}

async function main() {
  startTimer();
  process.stdout.write(util.format('\x1b[36m%s\x1b[0m', `Cleaning...`));
  await genClean();
  const cleanTime = readTimer();
  process.stdout.write(
    util.format('\x1b[32m%s\x1b[0m', `\rCleaning (${cleanTime}ms)\n`),
  );

  startTimer();
  process.stdout.write(util.format('\x1b[36m%s\x1b[0m', `Generating pages...`));
  await genFiles();
  const genTime = readTimer();
  process.stdout.write(
    util.format('\x1b[32m%s\x1b[0m', `\rGenerating pages (${genTime}ms)\n`),
  );
}

main();
