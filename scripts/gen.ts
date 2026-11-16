#!/usr/bin/env ts-node

import util from 'util';
import { genClean } from './gen-clean';
import { genArticles } from './gen-articles';
import { genIndexes } from './gen-indexes';
import { readTimer, startTimer } from './timer';
import { readFiles } from './traverse';

async function genPages(): Promise<void> {
  // Read the index once; genArticles returns an updated copy recording
  // the pages it wrote, which genIndexes then uses.
  const files = await readFiles();
  // gen page files for our mdx articles
  const withArticlePages = await genArticles(files);
  // gen "index" pages for any non-page path
  await genIndexes(withArticlePages);
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
  await genPages();
  const genPagesTime = readTimer();
  process.stdout.write(
    util.format(
      '\x1b[32m%s\x1b[0m',
      `\rGenerating pages (${genPagesTime}ms)\n`,
    ),
  );
}

main();
