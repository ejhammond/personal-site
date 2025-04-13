export type NextServerComponentProps<TParams> = {
  params: Promise<TParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
