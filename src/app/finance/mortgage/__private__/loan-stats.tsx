import { formatUSD } from '@/utils/currency';
import { formatMonths } from '@/utils/date';
import { Amortizations } from '@/utils/loan';

export default function LoanStats({
  amortizationsForOriginalLoan,
  amortizationsWithRefinances,
  amortizationsWithRefinancesAndPrepayments,
}: {
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

  return (
    <dl>
      <dt>Principal paid</dt>
      <dd>{formatUSD(totalPrincipalPaid)}</dd>
      <dt>Expected interest paid</dt>
      <dd>{formatUSD(expectedTotalInterestPaidForOriginalLoan)}</dd>
      <dt>Actual interest paid</dt>
      <dd>{formatUSD(totalInterestPaid)}</dd>
      {interestSavings != 0 && (
        <>
          <dt>Interest savings</dt>
          <dd>{formatUSD(interestSavings)}</dd>
        </>
      )}
      {interestSavingsDueToRefinances != 0 && (
        <>
          <dt>Interest savings due to refinances</dt>
          <dd>{formatUSD(interestSavingsDueToRefinances)}</dd>
        </>
      )}
      {interestSavingsDueToPrepayments !== 0 && (
        <>
          <dt>Interest savings due to prepayments</dt>
          <dd>{formatUSD(interestSavingsDueToPrepayments)}</dd>
        </>
      )}
      <dt>Expected duration</dt>
      <dd>{formatMonths(expectedDurationInMonths)}</dd>
      <dt>Actual duration</dt>
      <dd>{formatMonths(durationInMonths)}</dd>
      {durationDifference !== 0 && (
        <>
          <dt>Duration difference</dt>
          <dd>{formatMonths(durationDifference)}</dd>
        </>
      )}
    </dl>
  );
}
