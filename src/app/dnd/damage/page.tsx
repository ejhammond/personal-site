'use client';

import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Divider} from '@astryxdesign/core/Divider';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@astryxdesign/core/Layout';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Roll, rollToString} from '@/utils/dnd';
import {useCallback, useState} from 'react';

type DamageFormData = Roll & {
  critical: boolean;
};

type CalculateAverageDamageArgs = DamageFormData & {
  minAvgMax: 'min' | 'avg' | 'max';
};

const minAvgMaxDamage = {
  min: [1, 1, 1, 1, 1],
  avg: [2.5, 3.5, 4.5, 5.5, 6.5],
  max: [4, 6, 8, 10, 12],
};

function calculateAverageDamage({
  d4,
  d6,
  d8,
  d10,
  d12,
  modifier,
  critical,
  minAvgMax,
}: CalculateAverageDamageArgs): number {
  const damage = (() => {
    switch (minAvgMax) {
      case 'min':
        return minAvgMaxDamage.min;
      case 'avg':
        return minAvgMaxDamage.avg;
      case 'max':
        return minAvgMaxDamage.max;
    }
  })();
  const dice =
    d4 * damage[0] +
    d6 * damage[1] +
    d8 * damage[2] +
    d10 * damage[3] +
    d12 * damage[4];

  return critical ? 2 * dice + modifier : dice + modifier;
}

const Damage: React.FC = () => {
  const [damageFormData, setDamageFormData] = useState<DamageFormData>({
    d4: 0,
    d6: 0,
    d8: 1,
    d10: 0,
    d12: 0,
    modifier: 5,
    critical: false,
  });

  const {critical, d4, d6, d8, d10, d12, modifier} = damageFormData;
  const roll: Roll = {
    d4: critical ? 2 * d4 : d4,
    d6: critical ? 2 * d6 : d6,
    d8: critical ? 2 * d8 : d8,
    d10: critical ? 2 * d10 : d10,
    d12: critical ? 2 * d12 : d12,
    modifier,
  };

  const updateDamageFormData = useCallback(
    (merge: Partial<DamageFormData>) => {
      setDamageFormData((p) => ({...p, ...merge}));
    },
    [setDamageFormData],
  );

  return (
    <Layout
      height="fill"
      contentWidth={640}
      header={
        <LayoutHeader hasDivider padding={4} paddingBlockEnd={0}>
          <VStack gap={0}>
            <Heading level={1}>Damage</Heading>
            <Text type="supporting">Average damage for an attack roll</Text>
          </VStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent role="main">
          <VStack gap={4} padding={4}>
            <form id="damage">
              <VStack gap={3}>
                <NumberInput
                  label="D4"
                  min={0}
                  width={150}
                  isIntegerOnly
                  hasNumberSteppers
                  value={damageFormData.d4}
                  onChange={(number) => {
                    updateDamageFormData({d4: number});
                  }}
                />
                <NumberInput
                  label="D6"
                  min={0}
                  width={150}
                  isIntegerOnly
                  hasNumberSteppers
                  value={damageFormData.d6}
                  onChange={(number) => {
                    updateDamageFormData({d6: number});
                  }}
                />
                <NumberInput
                  label="D8"
                  min={0}
                  width={150}
                  isIntegerOnly
                  hasNumberSteppers
                  value={damageFormData.d8}
                  onChange={(number) => {
                    updateDamageFormData({d8: number});
                  }}
                />
                <NumberInput
                  label="D10"
                  min={0}
                  width={150}
                  isIntegerOnly
                  hasNumberSteppers
                  value={damageFormData.d10}
                  onChange={(number) => {
                    updateDamageFormData({d10: number});
                  }}
                />
                <NumberInput
                  label="D12"
                  min={0}
                  width={150}
                  isIntegerOnly
                  hasNumberSteppers
                  value={damageFormData.d12}
                  onChange={(number) => {
                    updateDamageFormData({d12: number});
                  }}
                />
                <NumberInput
                  label="Modifier"
                  width={150}
                  isIntegerOnly
                  hasNumberSteppers
                  value={damageFormData.modifier}
                  onChange={(number) => {
                    updateDamageFormData({modifier: number});
                  }}
                />
                <CheckboxInput
                  label="Critical"
                  value={damageFormData.critical}
                  onChange={(isCritical) => {
                    updateDamageFormData({critical: isCritical});
                  }}
                />
              </VStack>
            </form>
            <Text size="xl" aria-hidden>
              {rollToString(roll)}
            </Text>
            <Divider />
            <HStack gap={4}>
              <VStack>
                <Heading level={4}>Min</Heading>
                <Text size="xl" hasTabularNumbers>
                  {calculateAverageDamage({
                    ...damageFormData,
                    minAvgMax: 'min',
                  })}
                </Text>
              </VStack>
              <VStack>
                <Heading level={4}>Avg</Heading>
                <Text size="xl" hasTabularNumbers>
                  {calculateAverageDamage({
                    ...damageFormData,
                    minAvgMax: 'avg',
                  })}
                </Text>
              </VStack>
              <VStack>
                <Heading level={4}>Max</Heading>
                <Text size="xl" hasTabularNumbers>
                  {calculateAverageDamage({
                    ...damageFormData,
                    minAvgMax: 'max',
                  })}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
};

export default Damage;
