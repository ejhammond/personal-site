/** @jsxImportSource theme-ui */
import { Grid, jsx, Box, Flex, Label, Checkbox, Heading, Card, Text } from 'theme-ui';
import * as React from 'react';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { CounterInput } from '../../components/counter-input';
import { Breadcrumbs } from '../../components/breadcrumbs';
import type { Roll } from '../../utils';
import { rollToText } from '../../utils';

type DamageFormData = Roll & {
  critical: boolean;
};

type CalculateAverageDamageArgs = DamageFormData & { minAvgMax: 'min' | 'avg' | 'max' };

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
  const dice = d4 * damage[0] + d6 * damage[1] + d8 * damage[2] + d10 * damage[3] + d12 * damage[4];

  return critical ? 2 * dice + modifier : dice + modifier;
}

const Damage: React.FC = () => {
  const [damageFormData, setDamageFormData] = React.useState<DamageFormData>({
    d4: 0,
    d6: 0,
    d8: 1,
    d10: 0,
    d12: 0,
    modifier: 5,
    critical: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { critical, ...roll } = damageFormData;

  const updateDamageFormData = React.useCallback(
    (merge: Partial<DamageFormData>) => {
      setDamageFormData((p) => ({ ...p, ...merge }));
    },
    [setDamageFormData],
  );

  return (
    <Layout>
      <SEO title="D&D Damage" />
      <Breadcrumbs />
      <Heading mt={4} mb={2}>
        Damage
      </Heading>
      <Text sx={{ display: 'block' }} mb={4}>
        Calculate the expected damage of an attack.
      </Text>
      <Grid gap={16} columns={12}>
        <Box sx={{ gridColumn: ['span 12', 'span 6'] }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <CounterInput
              id="d4"
              label="D4"
              mb={3}
              min={0}
              value={damageFormData.d4}
              onChange={(number) => {
                updateDamageFormData({ d4: number });
              }}
            />
            <CounterInput
              id="d6"
              label="D6"
              mb={3}
              min={0}
              value={damageFormData.d6}
              onChange={(number) => {
                updateDamageFormData({ d6: number });
              }}
            />
            <CounterInput
              id="d8"
              label="D8"
              mb={3}
              min={0}
              value={damageFormData.d8}
              onChange={(number) => {
                updateDamageFormData({ d8: number });
              }}
            />
            <CounterInput
              id="d10"
              label="D10"
              mb={3}
              min={0}
              value={damageFormData.d10}
              onChange={(number) => {
                updateDamageFormData({ d10: number });
              }}
            />
            <CounterInput
              id="d12"
              label="D12"
              mb={3}
              min={0}
              value={damageFormData.d12}
              onChange={(number) => {
                updateDamageFormData({ d12: number });
              }}
            />
            <CounterInput
              id="damage-modifier"
              label="Damage Modifier"
              mb={3}
              value={damageFormData.modifier}
              onChange={(number) => {
                updateDamageFormData({ modifier: number });
              }}
            />
            <Label mb={3}>
              <Checkbox
                checked={damageFormData.critical}
                onChange={(e) => {
                  updateDamageFormData({ critical: e.currentTarget.checked });
                }}
              />

              <Flex sx={{ flexDirection: 'column' }}>
                <Text>Critical Hit</Text>
                <Text variant="secondary">Doubles the dice rolls</Text>
              </Flex>
            </Label>
          </form>
        </Box>
        <Card sx={{ gridColumn: ['span 6'], height: 'min-content' }}>
          <Grid gap={16} columns={6} sx={{ alignContent: 'start' }}>
            <Box sx={{ gridColumn: ['span 12', 'span 6'] }}>
              <Text aria-hidden sx={{ fontSize: [4, 5] }}>
                {rollToText(roll)}
              </Text>
            </Box>
            <Box sx={{ gridColumn: ['span 4', 'span 2'] }}>
              <Heading as="h4" mb={2}>
                Min
              </Heading>
              <Text sx={{ fontSize: [3, 4] }}>
                {calculateAverageDamage({ ...damageFormData, minAvgMax: 'min' })}
              </Text>
            </Box>
            <Box sx={{ gridColumn: ['span 4', 'span 2'] }}>
              <Heading as="h4" mb={2}>
                Avg
              </Heading>
              <Text sx={{ fontSize: [3, 4] }}>
                {calculateAverageDamage({ ...damageFormData, minAvgMax: 'avg' })}
              </Text>
            </Box>
            <Box sx={{ gridColumn: ['span 4', 'span 2'] }}>
              <Heading as="h4" mb={2}>
                Max
              </Heading>
              <Text sx={{ fontSize: [3, 4] }}>
                {calculateAverageDamage({ ...damageFormData, minAvgMax: 'max' })}
              </Text>
            </Box>
          </Grid>
        </Card>
      </Grid>
    </Layout>
  );
};

export default Damage;
