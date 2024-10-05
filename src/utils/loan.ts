'use strict';

type Loan = {
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
  const i = annualizedInterestRate / 12;

  return (
    principal * ((i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1))
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
  return principal * (annualizedInterestRate / 12);
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

type AmortizeInput = {
  loan: Loan;
  recurringExtraPayments?: RecurringExtraPayment[];
  oneOffExtraPayments?: OneOffExtraPayment[];
  refinances?: Loan & { month: number }[];
};

export type Amortization = {
  month: number;
  principal: number;
  balance: number;
  interest: number;
  extra: number;
}[];

/*
 * Run the loan simulation and return expected vs actual results
 */
export function amortize({
  loan: { principal, annualizedInterestRate, years },
  recurringExtraPayments = [],
  oneOffExtraPayments = [],
  // refinances = [],
}: AmortizeInput): Amortization {
  const months = years * 12;

  const prePayment = getOneOffExtraPaymentForMonth(oneOffExtraPayments, 0);

  const amortization: Amortization = [
    {
      month: 0,
      interest: 0,
      principal: 0,
      extra: prePayment,
      balance: principal - prePayment,
    },
  ];

  let balance = principal - prePayment;
  for (let i = 0; i < months; i++) {
    const month = i + 1;

    const minMonthlyPayment = getMinMonthlyPayment({
      principal,
      annualizedInterestRate,
      years,
    });

    const interestPayment = getAccruedInterest({
      principal: balance,
      annualizedInterestRate,
    });

    const basePrincipalPayment = minMonthlyPayment - interestPayment;

    const recurringExtraPayment = getRecurringExtraPaymentForMonth(
      recurringExtraPayments,
      month,
    );

    const oneOffExtraPayment = getOneOffExtraPaymentForMonth(
      oneOffExtraPayments,
      month,
    );

    const extraPrincipalPayment = recurringExtraPayment + oneOffExtraPayment;

    const principalPayment = basePrincipalPayment + extraPrincipalPayment;

    balance -= principalPayment;

    if (balance <= 0) {
      // we "add" the balance in case it went negative. This will "refund" some principal
      const finalMonthTotalPrincipalPayment =
        basePrincipalPayment + extraPrincipalPayment + balance;
      // the base principal in the final month may be lower than the typical base principal
      const finalMonthBasePrincipalPayment = Math.min(
        basePrincipalPayment,
        finalMonthTotalPrincipalPayment,
      );
      const finalMonthExtraPrincipalPayment =
        finalMonthTotalPrincipalPayment - finalMonthBasePrincipalPayment;

      amortization.push({
        month,
        interest: interestPayment,
        principal: finalMonthBasePrincipalPayment,
        extra: finalMonthExtraPrincipalPayment,
        balance: Math.max(balance, 0),
      });

      break;
    }

    amortization.push({
      month,
      interest: interestPayment,
      principal: basePrincipalPayment,
      extra: extraPrincipalPayment,
      balance,
    });
  }

  return amortization;
}
