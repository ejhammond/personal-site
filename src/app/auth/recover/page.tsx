import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import RequestPasswordResetForm from './request-password-reset-form';

export default async function RecoverPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');

  return <RequestPasswordResetForm next={next.or('/')} />;
}
