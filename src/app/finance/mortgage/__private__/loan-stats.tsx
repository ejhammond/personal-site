import { Card } from '@/ds/card';
import { formatUSD } from '@/utils/currency';
import { addMonths, formatMonths, MonthAndYear } from '@/utils/date';
import { Amortizations } from '@/utils/loan';
import { formatCompact } from '@/utils/number';
import { Text } from 'react-aria-components';

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
      <Card>
        <h3>Principal paid</h3>
        <div className="content">
          <div className="metric">
            <Text slot="metric-compact">
              ${formatCompact(totalPrincipalPaid)}
            </Text>
            <Text slot="supporting">{formatUSD(totalPrincipalPaid)}</Text>
          </div>
        </div>
      </Card>
      <Card>
        <h3>Interest saved</h3>
        <div className="content">
          <div className="metric" style={{ marginBlockEnd: 16 }}>
            <Text slot="metric-compact">${formatCompact(interestSavings)}</Text>
            <Text slot="supporting">{formatUSD(interestSavings)}</Text>
          </div>
          <div>
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
        </div>
      </Card>
      <Card>
        <h3>Time saved</h3>
        <div className="content">
          <div className="metric">
            <Text slot="metric-compact">
              {formatMonths(durationDifference, { compact: true })}
            </Text>
          </div>
          <Text slot="supporting">
            Mortgage free:{' '}
            <strong>
              {endDate.month} {endDate.year}
            </strong>
          </Text>
        </div>
      </Card>
    </div>
  );
}
