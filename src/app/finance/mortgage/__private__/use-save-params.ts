import { WithID } from '@/utils/id';
import {
  Loan,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  ORIGINAL_LOAN_PARAM,
  serializeOriginalLoan,
} from './use-original-loan-param';
import {
  RECURRING_EXTRA_PAYMENTS_PARAM,
  serializeRecurringExtraPayments,
} from './use-recurring-extra-payments-param';
import {
  ONE_OFF_EXTRA_PAYMENTS_PARAM,
  serializeOneOffExtraPayments,
} from './use-one-off-extra-paymentsParam';
import { REFINANCES_PARAM, serializeRefinances } from './use-refinances-param';
import {
  serializeStartingMonthAndYear,
  STARTING_MONTH_AND_YEAR_PARAM,
} from './use-starting-month-and-year-param';
import { MonthAndYear } from '@/utils/date';

export default function useSaveParams() {
  const pathname = usePathname();
  const params = useSearchParams();

  return useCallback(
    ({
      startingMonthAndYear,
      originalLoan,
      recurringExtraPayments,
      oneOffExtraPayments,
      refinances,
    }: {
      startingMonthAndYear: MonthAndYear;
      originalLoan: Loan;
      recurringExtraPayments: WithID<RecurringExtraPayment>[];
      oneOffExtraPayments: WithID<OneOffExtraPayment>[];
      refinances: WithID<Refinance>[];
    }) => {
      const newParams = new URLSearchParams(params.toString());
      newParams.set(
        STARTING_MONTH_AND_YEAR_PARAM,
        serializeStartingMonthAndYear(startingMonthAndYear),
      );
      newParams.set(ORIGINAL_LOAN_PARAM, serializeOriginalLoan(originalLoan));
      newParams.set(
        RECURRING_EXTRA_PAYMENTS_PARAM,
        serializeRecurringExtraPayments(recurringExtraPayments),
      );
      newParams.set(
        ONE_OFF_EXTRA_PAYMENTS_PARAM,
        serializeOneOffExtraPayments(oneOffExtraPayments),
      );
      newParams.set(REFINANCES_PARAM, serializeRefinances(refinances));

      window.history.pushState(
        null, // data
        '', // "unused"
        pathname + '?' + newParams.toString(),
      );
    },
    [params, pathname],
  );
}
