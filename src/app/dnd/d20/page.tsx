'use client';

import { Divider } from '@astryxdesign/core/Divider';
import { Layout, LayoutContent, LayoutHeader } from '@astryxdesign/core/Layout';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Selector } from '@astryxdesign/core/Selector';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
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
    <Layout
      height="fill"
      contentWidth={640}
      header={
        <LayoutHeader hasDivider padding={4} paddingBlockEnd={0}>
          <VStack gap={0}>
            <Heading level={1}>Roll chance</Heading>
            <Text type="supporting">Chance to meet a DC</Text>
          </VStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent role="main">
          <VStack gap={4} padding={4}>
            <form id="roll-chance">
              <VStack gap={3}>
                <NumberInput
                  label="Threshold"
                  min={0}
                  width={150}
                  isIntegerOnly
                  hasNumberSteppers
                  value={d20FormData.threshold}
                  onChange={(number) => {
                    updateD20FormData({ threshold: number });
                  }}
                />
                <NumberInput
                  label="Modifier"
                  min={-19}
                  max={19}
                  width={150}
                  isIntegerOnly
                  hasNumberSteppers
                  value={d20FormData.modifier}
                  onChange={(number) => {
                    updateD20FormData({ modifier: number });
                  }}
                />
                <Selector
                  label="Advantage"
                  value={d20FormData.advantage}
                  onChange={(value) => {
                    updateD20FormData({
                      advantage: value as Advantage,
                    });
                  }}
                  options={ADVANTAGE_SELECTOR_ITEMS}
                />
              </VStack>
            </form>
            <Divider />
            <Text size="xl" hasTabularNumbers>
              {(calculateHitChance(d20FormData) * 100).toFixed(2)}%
            </Text>
          </VStack>
        </LayoutContent>
      }
    />
  );
};

export default D20;
