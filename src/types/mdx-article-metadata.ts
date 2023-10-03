export type MDXArticleMetadata = Readonly<{
  articleKey: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: ReadonlyArray<string>;
  repoPath: string;
  uriPath: string;
}>;
