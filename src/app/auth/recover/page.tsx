import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import { AuthLayout } from '../auth-layout';
import RequestPasswordResetForm from './request-password-reset-form';

export default async function RecoverPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');

  return (
    <AuthLayout title="Account recovery">
      <RequestPasswordResetForm next={next.or('/')} />
    </AuthLayout>
  );
}
