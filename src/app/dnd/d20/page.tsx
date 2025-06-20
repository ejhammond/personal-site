'use client';

import { Counter } from '@/ds/counter';
import { Select, SelectItem } from '@/ds/select';
import { Text } from '@/ds/text';
import * as React from 'react';

import './page.css';
import { Form } from '@/ds/form';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';

type Advantage = 'none' | 'advantage' | 'disadvantage';

type D20FormData = {
  threshold: number;
  modifier: number;
  advantage: Advantage;
};

function getStandardRollChance(target: number): number {
  return 1 - (target - 1) * (1 / 20);
}

function getAdvantageRollChance(target: number): number {
  return 1 - Math.pow(target - 1, 2) * (1 / 400);
}

function getDisadvantageRollChance(target: number): number {
  return Math.pow(20 - (target - 1), 2) * (1 / 400);
}

function getChanceToRoll(target: number, advantage: Advantage): number {
  if (target < 1 || target > 20) {
    return 0;
  }

  switch (advantage) {
    case 'none':
      return getStandardRollChance(target);
    case 'advantage':
      return getAdvantageRollChance(target);
    case 'disadvantage':
      return getDisadvantageRollChance(target);
  }
}

type CalculateHitChanceArgs = D20FormData;

function calculateHitChance({
  threshold,
  modifier,
  advantage,
}: CalculateHitChanceArgs): number {
  const targetRoll = Math.max(threshold - modifier, 1);

  return getChanceToRoll(targetRoll, advantage);
}

const ADVANTAGE_SELECTOR_ITEMS = [
  { label: 'None', value: 'none' },
  { label: 'Advantage', value: 'advantage' },
  { label: 'Disadvantage', value: 'disadvantage' },
];

const D20: React.FC = () => {
  const [d20FormData, setD20FormData] = React.useState<D20FormData>({
    threshold: 16,
    modifier: 4,
    advantage: 'none',
  });
  const updateD20FormData = React.useCallback(
    (merge: Partial<D20FormData>) => {
      setD20FormData((p) => ({ ...p, ...merge }));
    },
    [setD20FormData],
  );

  return (
    <PageLayout
      type="form"
      header={
        <PageLayoutHeader title="Roll chance" subtitle="Chance to meet a DC" />
      }
    >
      <Form id="roll-chance">
        <Counter
          label="Threshold"
          min={0}
          value={d20FormData.threshold}
          onChange={(number) => {
            updateD20FormData({ threshold: number });
          }}
        />
        <Counter
          label="Modifier"
          value={d20FormData.modifier}
          min={-19}
          max={19}
          onChange={(number) => {
            console.log('change', number);
            updateD20FormData({ modifier: number });
          }}
        />
        <Select
          label="Advantage"
          selectedKey={d20FormData.advantage}
          onSelectionChange={(value) => {
            updateD20FormData({
              advantage: value as Advantage,
            });
          }}
          items={ADVANTAGE_SELECTOR_ITEMS}
        >
          {(item) => <SelectItem id={item.value}>{item.label}</SelectItem>}
        </Select>
      </Form>
      <hr style={{ marginBlock: 16 }} />
      <Text className="d20-output">
        {(calculateHitChance(d20FormData) * 100).toFixed(2)}%
      </Text>
    </PageLayout>
  );
};

export default D20;
