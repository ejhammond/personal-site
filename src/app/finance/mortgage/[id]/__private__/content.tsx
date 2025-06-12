'use client';

import { Fragment, useState } from 'react';
import {
  Amortizations,
  amortize,
  Loan,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';
import { formatUSD } from '@/utils/currency';
import { plural } from '@/utils/string';
import { VStack } from '@/ds/v-stack';
import React from 'react';
import AmortizationTable from './amortization-table';
import MortgageForm from './mortgage-form';
import { formatPercent } from '@/utils/number';
import MonthAndYearField from '@/ds/month-and-year-field';
import LoanStats from './loan-stats';
import { MonthAndYear } from '@/utils/date';
import { WithID } from '@/utils/id';
import useStartingMonthAndYear from './use-starting-month-and-year';
import EditableItemField from '@/ds/editable-item-field';

export default function Content({
  initialLoan,
  initialStartingMonthAndYear,
  initialRefinances,
  initialOneOffExtraPayments,
  initialRecurringExtraPayments,
}: {
  initialStartingMonthAndYear: MonthAndYear;
  initialLoan: Loan;
  initialRefinances: WithID<Refinance>[];
  initialOneOffExtraPayments: WithID<OneOffExtraPayment>[];
  initialRecurringExtraPayments: WithID<RecurringExtraPayment>[];
}) {
  const { startingMonthAndYear, setStartingMonthAndYear } =
    useStartingMonthAndYear(initialStartingMonthAndYear);

  const [amortizations, setAmortizations] = useState<{
    base: Amortizations;
    withRefinances: Amortizations;
    withRefinancesAndPrePayments: Amortizations;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  return (
    <VStack gap="sm">
      <EditableItemField<MonthAndYear>
        item={startingMonthAndYear}
        itemName="Starting date"
        renderItem={(item) => (
          <span>
            {item.month} {item.year}
          </span>
        )}
        onUpdate={(item) => setStartingMonthAndYear(item)}
        renderEditFormFields={(draftItem, setDraftItem) => (
          <>
            <MonthAndYearField
              label="Starting date"
              description="Month when the first payment is due"
              isRequired
              hasSelectOnFocus
              value={draftItem}
              onChange={setDraftItem}
            />
          </>
        )}
      />
      <MortgageForm
        initialLoan={initialLoan}
        initialRefinances={initialRefinances}
        initialOneOffExtraPayments={initialOneOffExtraPayments}
        initialRecurringExtraPayments={initialRecurringExtraPayments}
        error={error}
        startingMonthAndYear={startingMonthAndYear}
        onSubmit={({
          originalLoan,
          recurringExtraPayments,
          oneOffExtraPayments,
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
              recurringExtraPayments,
              oneOffExtraPayments,
              refinances,
            });

            setAmortizations({
              base,
              withRefinances,
              withRefinancesAndPrePayments,
            });

            setError(null);
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
              startingMonthAndYear={startingMonthAndYear}
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
                      {loan.years} {plural('year', 'years', loan.years)}
                    </h3>
                    <AmortizationTable
                      startingMonthAndYear={startingMonthAndYear}
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
