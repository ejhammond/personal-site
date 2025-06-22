import React from 'react';
import { VStack } from '@/ds/v-stack';
import { createClient } from '@/supabase/server';
import DirectoryListing from '@/ds/directory-listing';
import { redirect } from 'next/navigation';
import { CreateMortgageButton } from './__private__/create-mortgage-button';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';

export default async function Mortgage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect(`/auth/login?next=${encodeURIComponent('/finance/mortgages')}`);
  }

  const { data } = await supabase.from('mortgage').select('id, name');

  return (
    <PageLayout
      type="full"
      header={
        <PageLayoutHeader
          title="Mortgages"
          endContent={<CreateMortgageButton />}
        />
      }
    >
      <VStack gap="sm">
        {data?.map(({ id, name }) => (
          <DirectoryListing
            key={id}
            label={name}
            href={`/finance/mortgages/${id}`}
          />
        ))}
      </VStack>
    </PageLayout>
  );
}
