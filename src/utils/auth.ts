export function getNextPathname({
  searchParams,
  defaultPathname = '/',
}: {
  searchParams: URLSearchParams;
  defaultPathname?: string;
}): string {
  const nextFromParams = searchParams.get('next');

  return nextFromParams != null
    ? decodeURIComponent(nextFromParams)
    : defaultPathname;
}
