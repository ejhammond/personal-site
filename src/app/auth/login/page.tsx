import { Link } from '@astryxdesign/core/Link';
import { VStack } from '@astryxdesign/core/Stack';
import { createClient } from '@/supabase/server';
import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import { redirect } from 'next/navigation';
import { AuthLayout } from '../auth-layout';
import LogInForm from './log-in-form';

// Per-request page: renders from the auth session and/or query params,
// so it renders on demand instead of prerendering (Cache Components
// default is to prerender; `instant = false` opts out).
export const instant = false;


export default async function LogInPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user != null) {
    redirect('/auth/profile');
  }

  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');
  // The confirm route redirects here with ?error= when a confirmation
  // link is invalid or expired; show it instead of dropping it.
  const error = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'error');

  return (
    <AuthLayout title="Log in">
      <LogInForm next={next.or('/')} initialError={error.or(undefined)} />
      <VStack gap={1} hAlign="center">
        <Link href="/auth/sign-up">Need an account?</Link>
        <Link href="/auth/recover">Forgot password?</Link>
      </VStack>
    </AuthLayout>
  );
}
