'use strict';

import { roundCurrency } from './currency';

export type Loan = {
  principal: number;
  annualizedInterestRate: number;
  years: number;
  prePayment: number;
};

/*
 * Calculate the min monthly payment for a loan
 */
function getMinMonthlyPayment({
  principal,
  annualizedInterestRate,
  years,
}: Pick<Loan, 'principal' | 'annualizedInterestRate' | 'years'>) {
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
  prePayment: number;
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
  refinanceDisbursement?: number;
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
  const amortizations: {
    loan: Loan;
    amortization: Amortization;
  }[] = [];

  let amortization: Amortization = [];

  let currentLoan = originalLoan;
  let currentBalance = originalLoan.principal - originalLoan.prePayment;
  let currentMonth = -1; // start at -1 so the first iteration bumps to 0

  // iteratively calculate payments until the balance is 0 and there are no
  // future refinances
  while (currentBalance > 0 || refinances.some((r) => r.month > currentMonth)) {
    currentMonth++;

    const { principal, annualizedInterestRate, years, prePayment } =
      currentLoan;

    const minMonthlyPayment = getMinMonthlyPayment({
      principal,
      annualizedInterestRate,
      years,
    });

    const interestPayment = getAccruedInterest({
      principal: currentBalance,
      annualizedInterestRate,
    });

    const minPrincipalPayment = minMonthlyPayment - interestPayment;

    const recurringExtraPayment = getRecurringExtraPaymentForMonth(
      recurringExtraPayments,
      currentMonth,
    );

    const oneOffExtraPayment = getOneOffExtraPaymentForMonth(
      oneOffExtraPayments,
      currentMonth,
    );

    const extraPrincipalPayment = recurringExtraPayment + oneOffExtraPayment;

    const principalPayment = minPrincipalPayment + extraPrincipalPayment;

    // make the payment
    currentBalance = currentBalance - principalPayment;

    /**
     * Refinancing
     *
     * If we are refinancing to a new loan NEXT month, then the current loan
     * will be paid off THIS month. The new loan will pay the remaining balance
     * on the current loan after the current month's payment. Then we'll start
     * paying down the new loan.
     */
    const refinanceNextMonth = getRefinanceForMonth(
      refinances,
      currentMonth + 1,
    );
    let refinanceDisbursement = 0;
    if (refinanceNextMonth != null) {
      // we'll take the new loan principal and apply it directly to the current
      // loan as a payment. If the new loan does not have an explicit principal,
      // we'll assume that we just financed the exact remaining balance from the
      // current loan
      refinanceDisbursement = refinanceNextMonth.principal ?? currentBalance;
      currentBalance -= refinanceDisbursement;

      if (roundCurrency(currentBalance) > 0) {
        throw new Error('Refinance amount did not cover remaining balance.');
      }
    }

    // if we haven't paid off the loan yet, continue to the next month
    if (roundCurrency(currentBalance) > 0) {
      amortization.push({
        month: currentMonth,
        interest: interestPayment,
        principal: minPrincipalPayment,
        extra: extraPrincipalPayment,
        balance: currentBalance,
        refinanceDisbursement,
      });
      continue;
    }

    // if we got here, then the loan is paid off!

    // if balance is negative, then we overpaid and we get a refund
    const refund = currentBalance === 0 ? 0 : currentBalance * -1;
    currentBalance = 0;

    // final payment
    amortization.push({
      month: currentMonth,
      interest: interestPayment,
      principal: minPrincipalPayment,
      extra: extraPrincipalPayment - refund,
      balance: currentBalance,
      refinanceDisbursement,
    });

    // store the full amortization
    amortizations.push({
      loan: {
        principal,
        annualizedInterestRate,
        years,
        prePayment,
      },
      amortization,
    });

    // if we're refinancing next month, we'll keep iterating with new values
    if (refinanceNextMonth != null) {
      currentLoan = {
        // earlier, we calculated the refinance disbursement based on the
        // specified refinance.principal OR implicit principal from the current
        // loan balance
        principal: refinanceDisbursement,
        years: refinanceNextMonth.years,
        annualizedInterestRate: refinanceNextMonth.annualizedInterestRate,
        prePayment: refinanceNextMonth.prePayment,
      };
      currentBalance = refinanceDisbursement - refinanceNextMonth.prePayment;

      amortization = [];
      continue;
    } else {
      // otherwise we're done
      break;
    }
  }

  return amortizations;
}
