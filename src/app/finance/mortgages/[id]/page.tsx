import React, { Suspense } from 'react';
import './page.css';
import Content from './__private__/content';
import { createClient } from '@/supabase/server';
import { Loan, Payment, RecurringPayment, Refinance } from '@/utils/loan';
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
      id,
      name,
      updated_at,
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

  const loan: Loan = {
    start: {
      month: monthFromNumber(data.month),
      year: data.year,
    },
    principal: data.principal,
    term: data.term,
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
      term,
      annualizedInterestRate: annualized_interest_rate,
      prePayment: pre_payment ?? 0,
      month,
    }),
  );

  const payments = data.mortgage_payment.map<WithID<Payment>>(
    ({ id, month, amount }) => ({
      id: id.toString(),
      month,
      amount,
    }),
  );

  const recurringPayments = data.mortgage_recurring_payment.map<
    WithID<RecurringPayment>
  >(({ id, starting_month, amount }) => ({
    id: id.toString(),
    startingMonth: starting_month,
    amount,
  }));

  return (
    <Suspense>
      <Content
        key={data.updated_at}
        name={data.name}
        loanID={params.id}
        initialLoan={loan}
        initialRefinances={refinances}
        initialPayments={payments}
        initialRecurringPayments={recurringPayments}
      />
    </Suspense>
  );
}
