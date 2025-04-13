import { Link } from '@/ds/link';
import { VStack } from '@/ds/v-stack';
import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import SignUpForm from './sign-up-form';

export default async function SignUpPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');

  return (
    <VStack gap="md">
      <SignUpForm next={next.or('/')} />
      <Link href="/auth/login">Already have an account?</Link>
    </VStack>
  );
}
