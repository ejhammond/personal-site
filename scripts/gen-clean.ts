import fs from 'fs/promises';
import { Directory } from './gen';

/**
 * Removes any generated files in the directory
 */
export async function genClean(directory: Directory): Promise<void> {
  const generatedFiles = directory.files.filter((file) =>
    file.tags.has('generated'),
  );

  if (generatedFiles.length === 0) {
    return;
  }

  await Promise.all(generatedFiles.map((file) => fs.rm(file.path)));
}
