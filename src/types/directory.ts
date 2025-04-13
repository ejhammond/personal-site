export type FileTag =
  | 'article-page'
  | 'article-content'
  | 'article-meta'
  | 'page'
  | 'api-route'
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
export type DirectoryIndex = ReadonlyMap<string, Directory>;

type SerializableFile = Readonly<{
  path: string;
  tags: ReadonlyArray<FileTag>;
}>;
type SerializableDirectory = Readonly<{
  path: string;
  files: ReadonlyArray<SerializableFile>;
  subDirectories: ReadonlyArray<string>;
}>;
export type SerializableDirectoryIndex = ReadonlyArray<
  [string, SerializableDirectory]
>;

export function serializeDirectoryIndex(index: DirectoryIndex): string {
  const serializableDirectoryIndex: SerializableDirectoryIndex = Array.from(
    index.entries(),
  ).map(([path, dir]): [string, SerializableDirectory] => [
    path,
    {
      path: dir.path,
      files: dir.files.map((f) => ({
        path: f.path,
        tags: Array.from(f.tags),
      })),
      subDirectories: dir.subDirectories,
    },
  ]);

  return JSON.stringify(serializableDirectoryIndex, null, 2);
}

export function hydrateDirectoryIndex(
  serializableDirectoryIndex: SerializableDirectoryIndex,
): DirectoryIndex {
  const directoryIndex: DirectoryIndex = new Map(
    serializableDirectoryIndex.map(([path, dir]): [string, Directory] => [
      path,
      {
        path: dir.path,
        files: dir.files.map((f) => ({
          path: f.path,
          tags: new Set(Array.from(f.tags)),
        })),
        subDirectories: dir.subDirectories,
      },
    ]),
  );
  return directoryIndex;
}
