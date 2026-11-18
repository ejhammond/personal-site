import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import { AuthLayout } from '../auth-layout';
import ResetPasswordForm from './reset-password-form';

// Per-request page: renders from the auth session and/or query params,
// so it renders on demand instead of prerendering (Cache Components
// default is to prerender; `instant = false` opts out).
export const instant = false;

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
