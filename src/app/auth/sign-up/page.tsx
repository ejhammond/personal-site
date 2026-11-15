import { Link } from '@astryxdesign/core/Link';
import { VStack } from '@astryxdesign/core/Stack';
import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import { AuthLayout } from '../auth-layout';
import SignUpForm from './sign-up-form';

export default async function SignUpPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');

  return (
    <AuthLayout title="Sign up">
      <SignUpForm next={next.or('/')} />
      <VStack gap={1} hAlign="center">
        <Link href="/auth/login">Already have an account?</Link>
      </VStack>
    </AuthLayout>
  );
}
