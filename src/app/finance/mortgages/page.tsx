import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { HStack, StackItem, VStack } from '@astryxdesign/core/Stack';
import { Table, proportional } from '@astryxdesign/core/Table';
import type { TableColumn } from '@astryxdesign/core/Table';
import { Heading } from '@astryxdesign/core/Text';
import { CreateMortgageButton } from './__private__/create-mortgage-button';

type MortgageRow = {
  id: number;
  name: string;
};

const columns: TableColumn<MortgageRow>[] = [
  {
    key: 'name',
    header: 'Name',
    width: proportional(1),
    renderCell: (item) => (
      <Link href={`/finance/mortgages/${item.id}`}>{item.name}</Link>
    ),
  },
];

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
      content={
        <LayoutContent padding={0}>
          <VStack padding={4} gap={8}>
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
              <Table
                data={rows}
                columns={columns}
                idKey="id"
                density="balanced"
                dividers="none"
                hasHover
                textOverflow="truncate"
              />
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
