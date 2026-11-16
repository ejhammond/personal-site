import { NextServerComponentProps } from '@/types/next';
import { Maybe } from './maybe';

export async function genMaybeFromAsyncSearchParam(
  asyncSearchParams: NextServerComponentProps<unknown>['searchParams'],
  key: string,
): Promise<Maybe<string>> {
  const searchParams = await asyncSearchParams;
  // Values are already decoded by Next.js; decoding again would throw
  // URIError on a malformed escape (e.g. a stray %) for no benefit.
  return Maybe.fromNullish(searchParams[key]).map((v) =>
    Array.isArray(v) ? v[0] : v,
  );
}
