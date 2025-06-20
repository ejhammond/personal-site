'use client';

import { Fragment, useState } from 'react';
import {
  Amortizations,
  amortize,
  Loan,
  Payment,
  RecurringPayment,
  Refinance,
} from '@/utils/loan';
import { formatUSD } from '@/utils/currency';
import { plural } from '@/utils/string';
import { VStack } from '@/ds/v-stack';
import React from 'react';
import AmortizationTable from './amortization-table';
import MortgageForm from './mortgage-form';
import { formatPercent } from '@/utils/number';
import LoanStats from './loan-stats';
import { WithID } from '@/utils/id';
import { useLoan } from './loan/use-loan';
import useRefinances from './refinance/use-refinances';
import usePayments from './payment/use-payments';
import useRecurringPayments from './recurring-payment/use-recurring-payments';

export default function Content({
  loanID,
  initialLoan,
  initialRefinances,
  initialPayments,
  initialRecurringPayments,
}: {
  loanID: string;
  initialLoan: Loan;
  initialRefinances: WithID<Refinance>[];
  initialPayments: WithID<Payment>[];
  initialRecurringPayments: WithID<RecurringPayment>[];
}) {
  const loan = useLoan(loanID, initialLoan);
  const refinances = useRefinances(loanID, initialRefinances);
  const payments = usePayments(loanID, initialPayments);
  const recurringPayments = useRecurringPayments(
    loanID,
    initialRecurringPayments,
  );

  const [amortizations, setAmortizations] = useState<{
    base: Amortizations;
    withRefinances: Amortizations;
    withRefinancesAndPrePayments: Amortizations;
  } | null>(null);

  const [error, setError] = useState<string | undefined>();

  return (
    <VStack gap="sm">
      <MortgageForm
        loanID={loanID}
        loan={loan}
        refinances={refinances}
        payments={payments}
        recurringPayments={recurringPayments}
        error={error}
        onSubmit={({
          originalLoan,
          recurringPayments,
          payments,
          refinances,
        }) => {
          try {
            const base = amortize({ originalLoan });
            const withRefinances = amortize({
              originalLoan,
              refinances: refinances.map((refinance) => ({
                ...refinance,
                prePayment: 0,
              })),
            });
            const withRefinancesAndPrePayments = amortize({
              originalLoan,
              recurringPayments,
              payments,
              refinances,
            });

            setAmortizations({
              base,
              withRefinances,
              withRefinancesAndPrePayments,
            });

            setError(undefined);
          } catch (e: unknown) {
            if (e instanceof Error) {
              setError(e.message);
            }
          }
        }}
      />
      <hr style={{ alignSelf: 'stretch', marginBlock: 16 }} />
      <VStack gap="lg">
        {amortizations != null && (
          <VStack gap="md">
            <h3>Statistics</h3>
            <LoanStats
              amortizationsForOriginalLoan={amortizations.base}
              amortizationsWithRefinances={amortizations.withRefinances}
              amortizationsWithRefinancesAndPrepayments={
                amortizations.withRefinancesAndPrePayments
              }
            />
          </VStack>
        )}
        {amortizations != null &&
          amortizations.withRefinancesAndPrePayments.length > 0 && (
            <VStack gap="md" hAlign="stretch">
              {amortizations.withRefinancesAndPrePayments.map(
                ({ loan, amortization }, index) => (
                  <Fragment key={index}>
                    <h3>
                      Loan {index + 1} - {formatUSD(loan.principal)} at{' '}
                      {formatPercent(loan.annualizedInterestRate, 3)} for{' '}
                      {loan.term} {plural('year', 'years', loan.term)}
                    </h3>
                    <AmortizationTable
                      loan={loan}
                      amortization={amortization}
                    />
                  </Fragment>
                ),
              )}
            </VStack>
          )}
      </VStack>
    </VStack>
  );
}
