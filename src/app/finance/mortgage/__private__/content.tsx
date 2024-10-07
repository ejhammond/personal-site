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

export default function Content() {
  const saveParams = useSaveParams();

  const { startingMonthAndYear, setStartingMonthAndYear } =
    useStartingMonthAndYearParam();

  const [amortizations, setAmortizations] = useState<{
    base: Amortizations;
    withRefinances: Amortizations;
    withPrepayments: Amortizations;
  } | null>(null);

  const savings = (() => {
    if (amortizations == null) {
      return null;
    }

    const baseInterest = amortizations.base
      .flatMap(({ amortization }) =>
        amortization.map(({ interest }) => interest),
      )
      .reduce((acc, interest) => acc + interest, 0);
    const withRefinanceInterest = amortizations.withRefinances
      .flatMap(({ amortization }) =>
        amortization.map(({ interest }) => interest),
      )
      .reduce((acc, interest) => acc + interest, 0);
    const withPrepaymentsInterest = amortizations.withPrepayments
      .flatMap(({ amortization }) =>
        amortization.map(({ interest }) => interest),
      )
      .reduce((acc, interest) => acc + interest, 0);

    return {
      refinance: baseInterest - withRefinanceInterest,
      prepayment: withRefinanceInterest - withPrepaymentsInterest,
    };
  })();

  return (
    <VStack gap="sm">
      <Form>
        <MonthAndYearField
          label="Starting date"
          isRequired
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
      {savings?.refinance != null && savings.refinance !== 0 && (
        <>
          <h3>Savings due to refinancing</h3>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'var(--highlight-foreground)',
            }}
          >
            {formatUSD(savings?.refinance)}
          </span>
        </>
      )}
      {savings?.prepayment != null && savings.prepayment !== 0 && (
        <>
          <h3>Savings due to extra payments</h3>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'var(--highlight-foreground)',
            }}
          >
            {formatUSD(savings?.prepayment)}
          </span>
        </>
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
  );
}
