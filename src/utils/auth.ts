// Only same-origin absolute paths are safe redirect targets. Absolute
// URLs, protocol-relative //hosts, and backslash tricks (which some
// clients normalize to //) all fall back to the default, so a crafted
// ?next= can't send a user off-site after login.
export function isSafeNextPathname(next: unknown): next is string {
  return (
    typeof next === 'string' &&
    next.startsWith('/') &&
    !next.startsWith('//') &&
    !next.includes('\\')
  );
}

export function getNextPathname({
  searchParams,
  defaultPathname = '/',
}: {
  searchParams: URLSearchParams;
  defaultPathname?: string;
}): string {
  const nextFromParams = searchParams.get('next');

  // URLSearchParams values are already decoded; decoding again would throw
  // URIError on a stray % and is not needed.
  return isSafeNextPathname(nextFromParams) ? nextFromParams : defaultPathname;
}
