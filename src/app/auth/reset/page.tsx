import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import ResetPasswordForm from './reset-password-form';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';

export default async function ResetPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');

  return (
    <PageLayout
      type="form"
      header={<PageLayoutHeader title="Reset password" />}
    >
      <ResetPasswordForm next={next.or('/')} />
    </PageLayout>
  );
}
