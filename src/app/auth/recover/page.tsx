import { NextServerComponentProps } from '@/types/next';
import { genMaybeFromAsyncSearchParam } from '@/utils/search-params';
import RequestPasswordResetForm from './request-password-reset-form';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';

export default async function RecoverPage({
  searchParams: asyncSearchParams,
}: NextServerComponentProps<unknown>) {
  const next = await genMaybeFromAsyncSearchParam(asyncSearchParams, 'next');

  return (
    <PageLayout
      type="form"
      header={<PageLayoutHeader title="Account recovery" />}
    >
      <RequestPasswordResetForm next={next.or('/')} />
    </PageLayout>
  );
}
