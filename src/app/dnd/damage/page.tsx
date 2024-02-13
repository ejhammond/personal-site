'use client';

import { Card } from '@/ds/card';
import { Checkbox } from '@/ds/checkbox';
import { Counter } from '@/ds/counter';
import { HStack } from '@/ds/h-stack';
import { Text } from '@/ds/text';
import { VStack } from '@/ds/v-stack';
import { css } from '@/panda/css';
import { Roll, rollToString } from '@/utils/dnd';
import { useCallback, useState } from 'react';

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

  const { critical, d4, d6, d8, d10, d12, modifier } = damageFormData;
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
      setDamageFormData((p) => ({ ...p, ...merge }));
    },
    [setDamageFormData],
  );

  return (
    <>
      <h2>Damage</h2>
      <p className={css({ mb: 'lg' })}>
        Calculate the expected damage of an attack.
      </p>
      <Card css={{ maxWidth: 'min-content' }}>
        <div className={css({ mb: 'md' })}>
          <h4>Roll</h4>
          <Text aria-hidden variant="display" className={css({ mb: 'md' })}>
            {rollToString(roll)}
          </Text>
          <HStack gap="md">
            <VStack>
              <h4>Min</h4>
              <Text>
                {calculateAverageDamage({
                  ...damageFormData,
                  minAvgMax: 'min',
                })}
              </Text>
            </VStack>
            <VStack>
              <h4>Avg</h4>
              <Text>
                {calculateAverageDamage({
                  ...damageFormData,
                  minAvgMax: 'avg',
                })}
              </Text>
            </VStack>
            <VStack>
              <h4>Max</h4>
              <Text>
                {calculateAverageDamage({
                  ...damageFormData,
                  minAvgMax: 'max',
                })}
              </Text>
            </VStack>
          </HStack>
        </div>
        <hr className={css({ mb: 'md' })} />
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <VStack gap="md">
            <HStack gap="lg">
              <Counter
                label="D4"
                min={0}
                value={damageFormData.d4}
                onChange={(number) => {
                  updateDamageFormData({ d4: number });
                }}
              />
              <Counter
                label="D6"
                min={0}
                value={damageFormData.d6}
                onChange={(number) => {
                  updateDamageFormData({ d6: number });
                }}
              />
            </HStack>
            <HStack gap="lg">
              <Counter
                label="D8"
                min={0}
                value={damageFormData.d8}
                onChange={(number) => {
                  updateDamageFormData({ d8: number });
                }}
              />
              <Counter
                label="D10"
                min={0}
                value={damageFormData.d10}
                onChange={(number) => {
                  updateDamageFormData({ d10: number });
                }}
              />
            </HStack>
            <HStack gap="lg">
              <Counter
                label="D12"
                min={0}
                value={damageFormData.d12}
                onChange={(number) => {
                  updateDamageFormData({ d12: number });
                }}
              />
              <Counter
                label="Modifier"
                value={damageFormData.modifier}
                onChange={(number) => {
                  updateDamageFormData({ modifier: number });
                }}
              />
            </HStack>
            <Checkbox
              label="Critical Hit"
              subLabel="Doubles the dice rolls"
              checked={damageFormData.critical}
              onChange={(isCritical) => {
                updateDamageFormData({ critical: isCritical });
              }}
            />
          </VStack>
        </form>
      </Card>
    </>
  );
};

export default Damage;
