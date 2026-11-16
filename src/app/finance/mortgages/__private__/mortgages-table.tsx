'use client';

import { Link } from '@astryxdesign/core/Link';
import { Table, proportional } from '@astryxdesign/core/Table';
import type { TableColumn } from '@astryxdesign/core/Table';

export type MortgageRow = {
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

export function MortgagesTable({ rows }: { rows: MortgageRow[] }) {
  return (
    <Table
      data={rows}
      columns={columns}
      idKey="id"
      density="balanced"
      dividers="none"
      hasHover
      textOverflow="truncate"
    />
  );
}
