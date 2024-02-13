#!/usr/bin/env ts-node

import fs from 'fs/promises';
import { glob } from 'glob';

export async function genClean(): Promise<void> {
  const files = await glob('src/**/*.gen.*');
  await Promise.all(files.map((f) => fs.rm(f)));
}
