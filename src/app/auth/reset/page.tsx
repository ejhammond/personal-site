import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import { AuthLayout } from '../auth-layout';
import ResetPasswordForm from './reset-password-form';

export default async function ResetPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');

  return (
    <AuthLayout title="Reset password">
      <ResetPasswordForm next={next.or('/')} />
    </AuthLayout>
  );
}
