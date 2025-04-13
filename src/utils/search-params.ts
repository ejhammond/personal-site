import { NextServerComponentProps } from '@/types/next';
import { Maybe } from './maybe';

export async function genMaybeFromAsyncSearchParam(
  asyncSearchParams: NextServerComponentProps<unknown>['searchParams'],
  key: string,
): Promise<Maybe<string>> {
  const searchParams = await asyncSearchParams;
  return (
    Maybe.fromNullish(searchParams[key])
      // if there are duplicate keys just take the first
      .map((v) => (Array.isArray(v) ? v[0] : v))
      .map(decodeURIComponent)
  );
}
