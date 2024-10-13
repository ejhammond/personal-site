import { Form } from '@/ds/form';
import { WithID } from '@/utils/id';
import {
  Loan,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';
import useOriginalLoanParam from './use-original-loan-param';
import useRecurringExtraPaymentsParam from './use-recurring-extra-payments-param';
import useOneOffExtraPaymentsParam from './use-one-off-extra-paymentsParam';
import useRefinancesParam from './use-refinances-param';
import { Button } from '@/ds/button';
import { NumberField } from '@/ds/number-field';
import RecurringExtraPaymentsField from './recurring-extra-payments-field';
import OneOffExtraPaymentsField from './one-off-extra-payments-field';
import RefinancesField from './refinances-field';
import { MonthAndYear } from '@/utils/date';
import { CurrencyField } from '@/ds/currency-field';
import { VStack } from '@/ds/v-stack';
import { useMemo } from 'react';

export default function MortgageForm({
  onSubmit,
  startingMonthAndYear,
  error,
}: {
  error?: string | null;
  startingMonthAndYear: MonthAndYear;
  onSubmit: (data: {
    originalLoan: Loan;
    recurringExtraPayments: WithID<RecurringExtraPayment>[];
    oneOffExtraPayments: WithID<OneOffExtraPayment>[];
    refinances: WithID<Refinance>[];
  }) => void;
}) {
  const { originalLoan, setOriginalLoan } = useOriginalLoanParam();
  const {
    recurringExtraPayments,
    addRecurringExtraPayment,
    removeRecurringExtraPayment,
  } = useRecurringExtraPaymentsParam();
  const {
    oneOffExtraPayments,
    addOneOffExtraPayment,
    removeOneOffExtraPayment,
  } = useOneOffExtraPaymentsParam();
  const { refinances, addRefinance, removeRefinance } = useRefinancesParam();

  const mostRecentMonthUsed = useMemo(() => {
    const mostRecentRecurringExtraPaymentMonth = recurringExtraPayments.reduce(
      (max, { startingMonth }) => Math.max(max, startingMonth),
      0,
    );
    const mostRecentOneOffExtraPaymentMonth = oneOffExtraPayments.reduce(
      (max, { month }) => Math.max(max, month),
      0,
    );
    const mostRecentRefinanceMonth = refinances.reduce(
      (max, { month }) => Math.max(max, month),
      0,
    );

    return Math.max(
      mostRecentRecurringExtraPaymentMonth,
      mostRecentOneOffExtraPaymentMonth,
      mostRecentRefinanceMonth,
      0,
    );
  }, [oneOffExtraPayments, recurringExtraPayments, refinances]);

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit({
          originalLoan,
          recurringExtraPayments,
          oneOffExtraPayments,
          refinances,
        });
      }}
      footer={
        <VStack hAlign="end">
          <Button type="submit" variant="primary">
            Calculate
          </Button>
          {error != null && (
            <span style={{ fontSize: '12px', color: 'var(--invalid-color)' }}>
              {error}
            </span>
          )}
        </VStack>
      }
    >
      <CurrencyField
        label="Amount financed"
        isRequired
        hasSelectOnFocus
        value={originalLoan.principal}
        onChange={(principal) => setOriginalLoan((p) => ({ ...p, principal }))}
      />
      <NumberField
        label="Term"
        minValue={1}
        isRequired
        hasSelectOnFocus
        value={originalLoan.years}
        onChange={(years) => setOriginalLoan((p) => ({ ...p, years }))}
        formatOptions={{
          style: 'unit',
          unit: 'year',
          unitDisplay: 'long',
        }}
      />
      <NumberField
        label="Rate"
        isRequired
        hasSelectOnFocus
        minValue={0}
        maxValue={1}
        value={originalLoan.annualizedInterestRate}
        onChange={(annualizedInterestRate) =>
          setOriginalLoan((p) => ({ ...p, annualizedInterestRate }))
        }
        formatOptions={{
          style: 'percent',
          minimumFractionDigits: 3,
        }}
      />
      <CurrencyField
        label="Pre payment"
        description="Extra payment after down payment and before the first month's payment"
        hasSelectOnFocus
        value={originalLoan.prePayment}
        onChange={(prePayment) =>
          setOriginalLoan((p) => ({ ...p, prePayment }))
        }
      />
      <RefinancesField
        defaultMonth={mostRecentMonthUsed + 1}
        startingMonthAndYear={startingMonthAndYear}
        items={refinances}
        add={addRefinance}
        remove={removeRefinance}
      />
      <RecurringExtraPaymentsField
        defaultMonth={mostRecentMonthUsed + 1}
        startingMonthAndYear={startingMonthAndYear}
        items={recurringExtraPayments}
        add={addRecurringExtraPayment}
        remove={removeRecurringExtraPayment}
      />
      <OneOffExtraPaymentsField
        defaultMonth={mostRecentMonthUsed + 1}
        startingMonthAndYear={startingMonthAndYear}
        items={oneOffExtraPayments}
        add={addOneOffExtraPayment}
        remove={removeOneOffExtraPayment}
      />
    </Form>
  );
}
