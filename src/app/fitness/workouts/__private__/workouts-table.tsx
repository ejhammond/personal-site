'use client';

import { Link } from '@astryxdesign/core/Link';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import type { TableColumn } from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';

export type WorkoutRow = {
  id: number;
  name: string;
  sets: number;
  reps: number;
};

const columns: TableColumn<WorkoutRow>[] = [
  {
    key: 'name',
    header: 'Name',
    width: proportional(1),
    renderCell: (item) => (
      <Link href={`/fitness/workouts/${item.id}`}>{item.name}</Link>
    ),
  },
  {
    key: 'sets',
    header: 'Sets',
    width: pixel(80),
    align: 'end',
    renderCell: (item) => <Text hasTabularNumbers>{item.sets}</Text>,
  },
  {
    key: 'reps',
    header: 'Reps',
    width: pixel(80),
    align: 'end',
    renderCell: (item) => <Text hasTabularNumbers>{item.reps}</Text>,
  },
];

export function WorkoutsTable({ rows }: { rows: WorkoutRow[] }) {
  return (
    <Table
      aria-label="Workouts"
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
