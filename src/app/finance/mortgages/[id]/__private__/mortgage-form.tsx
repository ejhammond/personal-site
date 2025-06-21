import { WithID } from '@/utils/id';
import { Loan, Payment, RecurringPayment, Refinance } from '@/utils/loan';

import RefinancesField from './refinance/refinances-field';
import { VStack } from '@/ds/v-stack';
import { useMemo } from 'react';
import { mapToArray } from '@/utils/map';

import LoanField from './loan/loan-field';
import RecurringPaymentsField from './recurring-payment/recurring-payments-field';
import PaymentsField from './payment/payments-field';

export default function MortgageForm({
  loanID,
  loan,
  refinances,
  payments,
  recurringPayments,
}: {
  error?: string;
  loanID: string;
  loan: Loan;
  refinances: ReadonlyMap<string, WithID<Refinance>>;
  payments: ReadonlyMap<string, WithID<Payment>>;
  recurringPayments: ReadonlyMap<string, WithID<RecurringPayment>>;
}) {
  const mostRecentMonthUsed = useMemo(() => {
    const mostRecentRecurringExtraPaymentMonth = mapToArray(
      recurringPayments,
    ).reduce((max, { startingMonth }) => Math.max(max, startingMonth), 0);
    const mostRecentOneOffExtraPaymentMonth = mapToArray(payments).reduce(
      (max, { month }) => Math.max(max, month),
      0,
    );
    const mostRecentRefinanceMonth = mapToArray(refinances).reduce(
      (max, { month }) => Math.max(max, month),
      0,
    );

    return Math.max(
      mostRecentRecurringExtraPaymentMonth,
      mostRecentOneOffExtraPaymentMonth,
      mostRecentRefinanceMonth,
      0,
    );
  }, [payments, recurringPayments, refinances]);

  return (
    <VStack gap="md">
      <LoanField loanID={loanID} loan={loan} />
      <RefinancesField
        loanID={loanID}
        defaultMonth={mostRecentMonthUsed + 1}
        startingMonthAndYear={loan.start}
        items={refinances}
      />
      <RecurringPaymentsField
        loanID={loanID}
        defaultMonth={mostRecentMonthUsed + 1}
        startingMonthAndYear={loan.start}
        items={recurringPayments}
      />
      <PaymentsField
        loanID={loanID}
        defaultMonth={mostRecentMonthUsed + 1}
        startingMonthAndYear={loan.start}
        items={payments}
      />
    </VStack>
  );
}
