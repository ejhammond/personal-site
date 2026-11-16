import { Link } from '@astryxdesign/core/Link';
import { VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
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
      <Text type="supporting" color="secondary">
        Enter your email and we&apos;ll send you a link to reset your password.
      </Text>
      <RequestPasswordResetForm next={next.or('/')} />
      <VStack gap={1} hAlign="center">
        <Link href="/auth/login">Back to log in</Link>
      </VStack>
    </AuthLayout>
  );
}
