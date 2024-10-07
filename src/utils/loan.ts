'use strict';

import { roundCurrency } from './currency';

export type Loan = {
  principal: number;
  annualizedInterestRate: number;
  years: number;
};

/*
 * Calculate the min monthly payment for a loan
 */
function getMinMonthlyPayment({
  principal,
  annualizedInterestRate,
  years,
}: Loan) {
  const months = years * 12;

  // if the interest rate is 0, then the formula will fail
  if (annualizedInterestRate === 0) {
    return roundCurrency(principal / months);
  }

  const i = annualizedInterestRate / 12;

  return roundCurrency(
    principal * ((i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1)),
  );
}

/*
 * Get the amount of interest that will accrue at the end of the month for a
 * given loan balance and interest rate.
 */
function getAccruedInterest({
  principal,
  annualizedInterestRate,
}: {
  /**
   * Loan balance in dollars
   */
  principal: number;
  /**
   * Interest rate for the year e.g. for 5.5% enter 0.055
   */
  annualizedInterestRate: number;
}) {
  return roundCurrency(principal * (annualizedInterestRate / 12));
}

export type RecurringExtraPayment = {
  startingMonth: number;
  amount: number;
};

function getRecurringExtraPaymentForMonth(
  recurringExtraPayments: RecurringExtraPayment[],
  month: number,
) {
  if (recurringExtraPayments.length === 0) {
    return 0;
  }

  const reversed = recurringExtraPayments.sort(
    (a, b) => b.startingMonth - a.startingMonth,
  );

  // starting from the last entry, find the first entry that starts before the given month
  for (const { startingMonth, amount } of reversed) {
    if (startingMonth <= month) {
      return amount;
    }
  }

  // this should never happen (tm)
  return 0;
}

export type OneOffExtraPayment = {
  month: number;
  amount: number;
};

function getOneOffExtraPaymentForMonth(
  oneOffExtraPayments: OneOffExtraPayment[],
  month: number,
) {
  return oneOffExtraPayments.find(({ month: m }) => month === m)?.amount ?? 0;
}

export type Refinance = {
  principal: number | null;
  annualizedInterestRate: number;
  years: number;
  month: number;
};

function getRefinanceForMonth(
  refinances: Refinance[],
  month: number,
): Refinance | null {
  return refinances.find(({ month: m }) => month === m) ?? null;
}

type AmortizeInput = {
  originalLoan: Loan;
  recurringExtraPayments?: RecurringExtraPayment[];
  oneOffExtraPayments?: OneOffExtraPayment[];
  refinances?: Refinance[];
};

export type Amortization = {
  month: number;
  principal: number;
  balance: number;
  interest: number;
  extra: number;
}[];

export type Amortizations = {
  loan: Loan;
  amortization: Amortization;
}[];

/*
 * Run the loan simulation and return expected vs actual results
 */
export function amortize({
  originalLoan,
  recurringExtraPayments = [],
  oneOffExtraPayments = [],
  refinances = [],
}: AmortizeInput): Amortizations {
  const prePayment = getOneOffExtraPaymentForMonth(oneOffExtraPayments, 0);

  const amortizations: { loan: Loan; amortization: Amortization }[] = [];

  let amortization: Amortization = [
    {
      month: 0,
      interest: 0,
      principal: 0,
      extra: prePayment,
      balance: originalLoan.principal - prePayment,
    },
  ];

  let principal = originalLoan.principal;
  let years = originalLoan.years;
  let annualizedInterestRate = originalLoan.annualizedInterestRate;

  let balance = originalLoan.principal - prePayment;
  let month = 0;
  while (balance > 0 || refinances.some((r) => r.month > month)) {
    month++;

    const minMonthlyPayment = getMinMonthlyPayment({
      principal,
      annualizedInterestRate,
      years,
    });

    const interestPayment = getAccruedInterest({
      principal: balance,
      annualizedInterestRate,
    });

    const minPrincipalPayment = minMonthlyPayment - interestPayment;

    const recurringExtraPayment = getRecurringExtraPaymentForMonth(
      recurringExtraPayments,
      month,
    );

    const oneOffExtraPayment = getOneOffExtraPaymentForMonth(
      oneOffExtraPayments,
      month,
    );

    const extraPrincipalPayment = recurringExtraPayment + oneOffExtraPayment;

    const refinanceNextMonth = getRefinanceForMonth(refinances, month + 1);
    let refinancePayoff = 0;
    if (refinanceNextMonth != null) {
      // if we're refinancing to a new loan next month, we'll have to pay off
      // this loan completely first
      refinancePayoff = balance - minPrincipalPayment;
    }

    const principalPayment =
      minPrincipalPayment + extraPrincipalPayment + refinancePayoff;

    // make the payment
    balance = balance - principalPayment;

    if (balance <= 0) {
      // after we've made the payment, we have to check if we overpaid
      // we "add" the balance in case it went negative. This will "refund" some principal
      const finalMonthTotalPrincipalPayment = principalPayment + balance;

      // if we got a "refund" for overpaying, we'll need to see if our min
      // principal payment is actually lower this month
      const finalMonthMinPrincipalPayment = Math.min(
        minPrincipalPayment,
        finalMonthTotalPrincipalPayment,
      );

      // if we paid any extra principal this month, we need to make sure that it
      // reflects the refund as well. This will ensure that the loan gets paid
      // down to exactly 0 in the amortization even if larger payments were made
      const finalMonthExtraPrincipalPayment =
        finalMonthTotalPrincipalPayment - finalMonthMinPrincipalPayment;

      amortization.push({
        month,
        interest: interestPayment,
        principal: finalMonthMinPrincipalPayment,
        extra: finalMonthExtraPrincipalPayment,
        balance: Math.max(balance, 0),
      });

      amortizations.push({
        loan: {
          principal,
          annualizedInterestRate,
          years,
        },
        amortization,
      });

      // if we're refinancing next month, we'll keep iterating with new values
      if (refinanceNextMonth != null) {
        // if we don't have an explicit principal for the refinance, we'll
        // assume that we're refinancing the exact previous balance
        principal = refinanceNextMonth.principal ?? refinancePayoff;
        years = refinanceNextMonth.years;
        annualizedInterestRate = refinanceNextMonth.annualizedInterestRate;
        balance = principal - extraPrincipalPayment;

        amortization = [
          {
            month,
            principal: 0,
            interest: 0,
            // since the new loan starts next month, there will be a lump-sum
            // payoff for the current loan. Any extra payments that were
            // scheduled for this month will be applied to the new loan instead
            extra: extraPrincipalPayment,
            balance,
          },
        ];
        continue;
      } else {
        // otherwise we're done
        break;
      }
    }

    amortization.push({
      month,
      interest: interestPayment,
      principal: minPrincipalPayment,
      extra: extraPrincipalPayment,
      balance,
    });
  }

  return amortizations;
}
