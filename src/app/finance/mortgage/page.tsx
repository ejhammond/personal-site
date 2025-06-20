import React from 'react';
import { VStack } from '@/ds/v-stack';
import { createClient } from '@/supabase/server';
import DirectoryListing from '@/ds/directory-listing';
import { redirect } from 'next/navigation';
import { CreateMortgageButton } from './__private__/create-mortgage-button';

export default async function Mortgage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect(`/auth/login?next=${encodeURIComponent('/finance/mortgage')}`);
  }

  const { data } = await supabase.from('mortgage').select('id, name');

  return (
    <>
      <VStack gap="md">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <h2>Mortgages</h2>
          <CreateMortgageButton />
        </div>
        <VStack gap="sm">
          {data?.map(({ id, name }) => (
            <DirectoryListing
              key={id}
              label={name}
              href={`/finance/mortgage/${id}`}
            />
          ))}
        </VStack>
      </VStack>
    </>
  );
}
