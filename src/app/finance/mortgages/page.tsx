import { BackLink } from '@/app/back-link';
import { SiteFooter } from '@/app/site-footer';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { HStack, StackItem, VStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Text';
import { CreateMortgageButton } from './__private__/create-mortgage-button';
import { MortgagesTable } from './__private__/mortgages-table';
import type { MortgageRow } from './__private__/mortgages-table';

// Per-request page: renders from the auth session and/or query params,
// so it renders on demand instead of prerendering (Cache Components
// default is to prerender; `instant = false` opts out).
export const instant = false;


export default async function Mortgage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect(`/auth/login?next=${encodeURIComponent('/finance/mortgages')}`);
  }

  const { data } = await supabase.from('mortgage').select('id, name');
  const rows: MortgageRow[] = data ?? [];

  return (
    <Layout
      height="fill"
      contentWidth={960}
      footer={
        <LayoutFooter hasDivider padding={4}>
          <SiteFooter />
        </LayoutFooter>
      }
      content={
        <LayoutContent padding={0}>
          <VStack padding={4} gap={8}>
            <HStack hAlign="start">
              <BackLink href="/finance" />
            </HStack>
            <HStack gap={3} vAlign="center">
              <StackItem size="fill">
                <Heading level={1}>Mortgages</Heading>
              </StackItem>
              <CreateMortgageButton />
            </HStack>
            {rows.length === 0 ? (
              <EmptyState
                title="No mortgages yet"
                description="Create your first mortgage to start tracking it."
              />
            ) : (
              <MortgagesTable rows={rows} />
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
