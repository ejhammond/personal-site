import { Card } from '@/ds/card';
import { HStack } from '@/ds/h-stack';
import { formatUSD } from '@/utils/currency';
import { addMonths, formatMonths, MonthAndYear } from '@/utils/date';
import { Amortizations } from '@/utils/loan';
import { formatCompact } from '@/utils/number';
import React, { ReactNode } from 'react';
import { Text } from 'react-aria-components';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

function MetricDelta({
  direction,
  sentiment,
  children,
}: {
  direction: 'up' | 'down';
  sentiment: '+' | '-';
  children: ReactNode;
}) {
  const color =
    sentiment === '+' ? 'var(--positive-color)' : 'var(--negative-color)';

  return (
    <HStack gap="sm" vAlign="center">
      {direction === 'up' ? (
        <FaArrowUp style={{ color }} />
      ) : (
        <FaArrowDown style={{ color }} />
      )}
      <div>{children}</div>
    </HStack>
  );
}

export default function LoanStats({
  startingMonthAndYear,
  amortizationsForOriginalLoan,
  amortizationsWithRefinances,
  amortizationsWithRefinancesAndPrepayments,
}: {
  startingMonthAndYear: MonthAndYear;
  amortizationsForOriginalLoan: Amortizations;
  amortizationsWithRefinances: Amortizations;
  amortizationsWithRefinancesAndPrepayments: Amortizations;
}) {
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

  const durationInMonths = amortizationsWithRefinancesAndPrepayments
    .flatMap(({ amortization }) => amortization)
    // assume there's at least one element
    .at(-1)!.month;

  const expectedDurationInMonths = amortizationsForOriginalLoan
    .flatMap(({ amortization }) => amortization)
    // assume there's at least one element
    .at(-1)!.month;

  const durationDifference = expectedDurationInMonths - durationInMonths;

  const endDate = addMonths(startingMonthAndYear, durationInMonths);

  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      }}
    >
      <Card header={<h3>Principal paid</h3>}>
        <div className="metric">
          <Text slot="metric-compact">
            ${formatCompact(totalPrincipalPaid)}
          </Text>
          <Text slot="supporting">{formatUSD(totalPrincipalPaid)}</Text>
        </div>
      </Card>
      <Card
        header={<h3>Interest paid</h3>}
        footer={
          <div>
            {interestSavings !== 0 && (
              <Text slot="supporting">
                <MetricDelta
                  direction={interestSavings > 0 ? 'down' : 'up'}
                  sentiment={interestSavings > 0 ? '+' : '-'}
                >
                  <strong>{formatUSD(interestSavings)}</strong>
                </MetricDelta>
              </Text>
            )}
            {interestSavingsDueToRefinances !== 0 && (
              <Text slot="supporting">
                From refinance:{' '}
                <strong>{formatUSD(interestSavingsDueToRefinances)}</strong>
              </Text>
            )}
            {interestSavingsDueToPrepayments !== 0 && (
              <Text slot="supporting">
                From prepayment:{' '}
                <strong>{formatUSD(interestSavingsDueToPrepayments)}</strong>
              </Text>
            )}
          </div>
        }
      >
        <div className="metric" style={{ marginBlockEnd: 16 }}>
          <Text slot="metric-compact">${formatCompact(totalInterestPaid)}</Text>
          <Text slot="supporting">{formatUSD(totalInterestPaid)}</Text>
        </div>
      </Card>
      <Card
        header={<h3>Duration</h3>}
        footer={
          <>
            {durationDifference !== 0 && (
              <Text slot="supporting">
                <MetricDelta
                  direction={durationDifference > 0 ? 'down' : 'up'}
                  sentiment={durationDifference > 0 ? '+' : '-'}
                >
                  <strong>{formatMonths(durationDifference)}</strong>
                </MetricDelta>
              </Text>
            )}
            <Text slot="supporting">
              Mortgage free:{' '}
              <strong>
                {endDate.month} {endDate.year}
              </strong>
            </Text>
          </>
        }
      >
        <div className="metric">
          <Text slot="metric-compact">
            {formatMonths(durationInMonths, { compact: true })}
          </Text>
        </div>
      </Card>
    </div>
  );
}
