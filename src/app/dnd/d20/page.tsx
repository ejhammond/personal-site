'use client';

import { Card } from '@/ds/card';
import { Counter } from '@/ds/counter';
import { HStack } from '@/ds/h-stack';
import { Select, SelectItem } from '@/ds/select';
import { vStack } from '@/ds/styles/v-stack-style';
import { Text } from '@/ds/text';
import * as React from 'react';

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
    <>
      <h2>Roll Chance</h2>
      <p style={{ marginBlockEnd: '16px' }}>
        Calculate your chance to meet a certain threshold with a D20 roll.
      </p>
      <Card
        style={{
          maxWidth: '600',
          marginInline: 'auto',
          ...vStack({ gap: 'md' }),
        }}
      >
        <form
          style={vStack({ gap: 'md' })}
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <HStack gap="lg" wrap="wrap">
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
          </HStack>
        </form>
        <hr />
        <Text style={{ fontSize: '24px' }}>
          {(calculateHitChance(d20FormData) * 100).toFixed(2)}%
        </Text>
      </Card>
    </>
  );
};

export default D20;
