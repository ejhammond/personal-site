import { Link } from '@/ds/link';
import { VStack } from '@/ds/v-stack';
import { createClient } from '@/supabase/server';
import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import { redirect } from 'next/navigation';
import LogInForm from './log-in-form';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';

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

  return (
    <PageLayout type="form" header={<PageLayoutHeader title="Log in" />}>
      <VStack gap="md">
        <LogInForm next={next.or('/')} />
        <VStack gap="sm">
          <Link href="/auth/sign-up">Need an account?</Link>
          <Link href="/auth/recover">Forgot password?</Link>
        </VStack>
      </VStack>
    </PageLayout>
  );
}
