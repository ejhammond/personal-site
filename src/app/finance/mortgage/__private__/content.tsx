'use client';

import { Fragment, useState } from 'react';
import useSaveParams from './use-save-params';
import { Amortizations, amortize } from '@/utils/loan';
import { formatUSD } from '@/utils/currency';
import { plural } from '@/utils/string';
import { VStack } from '@/ds/v-stack';
import React from 'react';
import AmortizationTable from './amortization-table';
import MortgageForm from './mortgage-form';
import { formatPercent } from '@/utils/number';
import useStartingMonthAndYearParam from './use-starting-month-and-year-param';
import { Form } from '@/ds/form';
import MonthAndYearField from './month-and-year-field';
import LoanStats from './loan-stats';

export default function Content() {
  const saveParams = useSaveParams();

  const { startingMonthAndYear, setStartingMonthAndYear } =
    useStartingMonthAndYearParam();

  const [amortizations, setAmortizations] = useState<{
    base: Amortizations;
    withRefinances: Amortizations;
    withPrepayments: Amortizations;
  } | null>(null);

  return (
    <VStack gap="sm">
      <Form>
        <MonthAndYearField
          label="Starting date"
          isRequired
          hasSelectOnFocus
          value={startingMonthAndYear}
          onChange={setStartingMonthAndYear}
        />
      </Form>
      <MortgageForm
        startingMonthAndYear={startingMonthAndYear}
        onSubmit={({
          originalLoan,
          recurringExtraPayments,
          oneOffExtraPayments,
          refinances,
        }) => {
          setAmortizations({
            base: amortize({
              originalLoan,
            }),
            withRefinances: amortize({
              originalLoan,
              refinances,
            }),
            withPrepayments: amortize({
              originalLoan,
              recurringExtraPayments,
              oneOffExtraPayments,
              refinances,
            }),
          });

          saveParams({
            startingMonthAndYear,
            originalLoan,
            recurringExtraPayments,
            oneOffExtraPayments,
            refinances,
          });
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
                amortizations.withPrepayments
              }
            />
          </VStack>
        )}
        {amortizations != null && amortizations.withPrepayments.length > 0 && (
          <VStack gap="md" hAlign="stretch">
            {amortizations.withPrepayments.map(
              ({ loan, amortization }, index) => (
                <Fragment key={index}>
                  <h3>
                    Loan {index + 1} - {formatUSD(loan.principal)} at{' '}
                    {formatPercent(loan.annualizedInterestRate, 3)} for{' '}
                    {loan.years} {plural('year', 'years', loan.years)}
                  </h3>
                  <AmortizationTable
                    startingMonthAndYear={startingMonthAndYear}
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
