import { Link } from '@/ds/link';
import { VStack } from '@/ds/v-stack';
import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import SignUpForm from './sign-up-form';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';

export default async function SignUpPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');

  return (
    <PageLayout type="form" header={<PageLayoutHeader title="Sign up" />}>
      <VStack gap="md">
        <SignUpForm next={next.or('/')} />
        <Link href="/auth/login">Already have an account?</Link>
      </VStack>
    </PageLayout>
  );
}
