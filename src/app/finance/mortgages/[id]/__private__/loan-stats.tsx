import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { Icon } from '@astryxdesign/core/Icon';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { formatUSD } from '@/utils/currency';
import { addMonths, formatMonths } from '@/utils/date';
import { Amortizations } from '@/utils/loan';
import { formatCompact } from '@/utils/number';
import React, { ReactNode } from 'react';

function MetricDelta({
  direction,
  sentiment,
  children,
}: {
  direction: 'up' | 'down';
  sentiment: '+' | '-';
  children: ReactNode;
}) {
  return (
    <HStack gap={1} vAlign="center">
      <Icon
        icon={direction === 'up' ? 'arrowUp' : 'arrowDown'}
        size="sm"
        color={sentiment === '+' ? 'success' : 'error'}
      />
      <Text type="supporting" weight="bold">
        {children}
      </Text>
    </HStack>
  );
}

export default function LoanStats({
  amortizationsForOriginalLoan,
  amortizationsWithRefinances,
  amortizationsWithRefinancesAndPrepayments,
}: {
  amortizationsForOriginalLoan: Amortizations;
  amortizationsWithRefinances: Amortizations;
  amortizationsWithRefinancesAndPrepayments: Amortizations;
}) {
  const startingMonthAndYear = amortizationsForOriginalLoan[0].loan.start;

  const totalFromPrincipalPrePayments =
    amortizationsWithRefinancesAndPrepayments.reduce(
      (acc, { loan: { prePayment } }) => acc + prePayment,
      0,
    );

  const totalFromMinPrincipalPayments =
    amortizationsWithRefinancesAndPrepayments
      .flatMap(({ amortization }) => amortization)
      .reduce((acc, { principal }) => acc + principal, 0);

  const totalFromExtraPrincipalPayments =
    amortizationsWithRefinancesAndPrepayments
      .flatMap(({ amortization }) => amortization)
      .reduce((acc, { extra }) => acc + extra, 0);

  const totalPrincipalPaid =
    totalFromPrincipalPrePayments +
    totalFromMinPrincipalPayments +
    totalFromExtraPrincipalPayments;

  const totalInterestPaid = amortizationsWithRefinancesAndPrepayments
    .flatMap(({ amortization }) => amortization)
    .reduce((acc, { interest }) => acc + interest, 0);

  const expectedTotalInterestPaidForOriginalLoan = amortizationsForOriginalLoan
    .flatMap(({ amortization }) => amortization)
    .reduce((acc, { interest }) => acc + interest, 0);

  const expectedTotalInterestPaidWithRefinances = amortizationsWithRefinances
    .flatMap(({ amortization }) => amortization)
    .reduce((acc, { interest }) => acc + interest, 0);

  const interestSavings =
    expectedTotalInterestPaidForOriginalLoan - totalInterestPaid;

  const interestSavingsDueToRefinances =
    expectedTotalInterestPaidForOriginalLoan -
    expectedTotalInterestPaidWithRefinances;

  const interestSavingsDueToPrepayments =
    expectedTotalInterestPaidWithRefinances - totalInterestPaid;

  const durationInMonths =
    amortizationsWithRefinancesAndPrepayments
      .flatMap(({ amortization }) => amortization)
      // assume there's at least one element
      .at(-1)!.month + 1; // add 1 to adjust 0-index

  const expectedDurationInMonths =
    amortizationsForOriginalLoan
      .flatMap(({ amortization }) => amortization)
      // assume there's at least one element
      .at(-1)!.month + 1; // add 1 to adjust 0-index

  const durationDifference = expectedDurationInMonths - durationInMonths;

  const endDate = addMonths(startingMonthAndYear, durationInMonths);

  return (
    <Grid columns={{ minWidth: 240 }} gap={4}>
      <Card>
        <VStack gap={2}>
          <Heading level={3}>Principal paid</Heading>
          <Text size="2xl" hasTabularNumbers>
            ${formatCompact(totalPrincipalPaid)}
          </Text>
          <Text type="supporting">{formatUSD(totalPrincipalPaid)}</Text>
        </VStack>
      </Card>
      <Card>
        <VStack gap={2}>
          <Heading level={3}>Interest paid</Heading>
          <Text size="2xl" hasTabularNumbers>
            ${formatCompact(totalInterestPaid)}
          </Text>
          <Text type="supporting">{formatUSD(totalInterestPaid)}</Text>
          {interestSavings !== 0 && (
            <MetricDelta
              direction={interestSavings > 0 ? 'down' : 'up'}
              sentiment={interestSavings > 0 ? '+' : '-'}
            >
              {formatUSD(interestSavings)}
            </MetricDelta>
          )}
          {interestSavingsDueToRefinances !== 0 && (
            <Text type="supporting">
              From refinance:{' '}
              <Text type="supporting" weight="bold">
                {formatUSD(interestSavingsDueToRefinances)}
              </Text>
            </Text>
          )}
          {interestSavingsDueToPrepayments !== 0 && (
            <Text type="supporting">
              From prepayment:{' '}
              <Text type="supporting" weight="bold">
                {formatUSD(interestSavingsDueToPrepayments)}
              </Text>
            </Text>
          )}
        </VStack>
      </Card>
      <Card>
        <VStack gap={2}>
          <Heading level={3}>Duration</Heading>
          <Text size="2xl" hasTabularNumbers>
            {formatMonths(durationInMonths)}
          </Text>
          {durationDifference !== 0 && (
            <MetricDelta
              direction={durationDifference > 0 ? 'down' : 'up'}
              sentiment={durationDifference > 0 ? '+' : '-'}
            >
              {formatMonths(durationDifference)}
            </MetricDelta>
          )}
          <Text type="supporting">
            Mortgage free:{' '}
            <Text type="supporting" weight="bold">
              {endDate.month} {endDate.year}
            </Text>
          </Text>
        </VStack>
      </Card>
    </Grid>
  );
}
