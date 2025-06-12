import React, { Suspense } from 'react';
import './page.css';
import { VStack } from '@/ds/v-stack';
import Content from './__private__/content';
import { createClient } from '@/supabase/server';
import {
  Loan,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';
import { monthFromNumber } from '@/utils/date';
import { notFound } from 'next/navigation';
import { WithID } from '@/utils/id';

export default async function MortgageID({
  params: asyncParams,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await asyncParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from('mortgage')
    .select(
      `
      updated_at,
      id,
      month,
      year,
      principal,
      term,
      annualized_interest_rate,
      pre_payment,
      mortgage_refinance (
        id,
        month,
        principal,
        term,
        annualized_interest_rate,
        pre_payment
      ),
      mortgage_payment (
        id,
        month,
        amount
      ),
      mortgage_recurring_payment (
        id,
        starting_month,
        amount
      )
      `,
    )
    .match({ id: params.id })
    .single();

  if (data == null) {
    notFound();
  }

  const startingMonthAndYear = {
    month: monthFromNumber(data.month),
    year: data.year,
  };

  const loan: Loan = {
    principal: data.principal,
    years: data.term,
    annualizedInterestRate: data.annualized_interest_rate,
    prePayment: data.pre_payment ?? 0,
  };

  const refinances = data.mortgage_refinance.map<WithID<Refinance>>(
    ({
      id,
      principal,
      term,
      annualized_interest_rate,
      pre_payment,
      month,
    }) => ({
      id: id.toString(),
      principal,
      years: term,
      annualizedInterestRate: annualized_interest_rate,
      prePayment: pre_payment ?? 0,
      month,
    }),
  );

  const oneOffExtraPayments = data.mortgage_payment.map<
    WithID<OneOffExtraPayment>
  >(({ id, month, amount }) => ({
    id: id.toString(),
    month,
    amount,
  }));

  const recurringExtraPayments = data.mortgage_recurring_payment.map<
    WithID<RecurringExtraPayment>
  >(({ id, starting_month, amount }) => ({
    id: id.toString(),
    startingMonth: starting_month,
    amount,
  }));

  return (
    <VStack gap="md">
      <h2>Mortgage Calculator</h2>
      <Suspense>
        <Content
          key={data.updated_at}
          initialStartingMonthAndYear={startingMonthAndYear}
          initialLoan={loan}
          initialRefinances={refinances}
          initialOneOffExtraPayments={oneOffExtraPayments}
          initialRecurringExtraPayments={recurringExtraPayments}
        />
      </Suspense>
    </VStack>
  );
}
