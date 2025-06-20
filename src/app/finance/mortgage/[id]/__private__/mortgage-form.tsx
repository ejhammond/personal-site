import { WithID } from '@/utils/id';
import { Loan, Payment, RecurringPayment, Refinance } from '@/utils/loan';

import { Button } from '@/ds/button';
import RefinancesField from './refinance/refinances-field';
import { VStack } from '@/ds/v-stack';
import { useMemo } from 'react';
import { mapToArray } from '@/utils/map';

import StatusMessage from '@/ds/status-message';
import LoanField from './loan/loan-field';
import RecurringPaymentsField from './recurring-payment/recurring-payments-field';
import PaymentsField from './payment/payments-field';

export default function MortgageForm({
  onSubmit,
  loanID,
  loan,
  refinances,
  payments,
  recurringPayments,
  error,
}: {
  error?: string;
  loanID: string;
  loan: Loan;
  refinances: ReadonlyMap<string, WithID<Refinance>>;
  payments: ReadonlyMap<string, WithID<Payment>>;
  recurringPayments: ReadonlyMap<string, WithID<RecurringPayment>>;
  onSubmit: (data: {
    originalLoan: Loan;
    recurringPayments: WithID<RecurringPayment>[];
    payments: WithID<Payment>[];
    refinances: WithID<Refinance>[];
  }) => void;
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

      <VStack gap="sm" hAlign="end">
        <Button
          variant="primary"
          onClick={() => {
            onSubmit({
              originalLoan: loan,
              recurringPayments: mapToArray(recurringPayments),
              payments: mapToArray(payments),
              refinances: mapToArray(refinances),
            });
          }}
        >
          Calculate
        </Button>
        {error != null && <StatusMessage variant="error" message={error} />}
      </VStack>
    </VStack>
  );
}
