import { Form } from '@/ds/form';
import { WithID } from '@/utils/id';
import {
  Loan,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';

import { Button } from '@/ds/button';
import { NumberField } from '@/ds/number-field';
import RecurringExtraPaymentsField from './recurring-extra-payments-field';
import OneOffExtraPaymentsField from './one-off-extra-payments-field';
import RefinancesField from './refinances-field';
import { MonthAndYear } from '@/utils/date';
import { CurrencyField } from '@/ds/currency-field';
import { VStack } from '@/ds/v-stack';
import { useMemo } from 'react';
import { arrayToMap } from '@/utils/map';
import useOriginalLoan from './use-original-loan';
import useRecurringExtraPayments from './use-recurring-extra-payments';
import useOneOffExtraPayments from './use-one-off-extra-payments';
import useRefinances from './use-refinances-param';
import { formatUSD } from '@/utils/currency';
import { formatPercent } from '@/utils/number';
import { plural } from '@/utils/string';
import EditableItemField from '@/ds/editable-item-field';

export default function MortgageForm({
  onSubmit,
  startingMonthAndYear,
  initialLoan,
  initialRefinances,
  initialOneOffExtraPayments,
  initialRecurringExtraPayments,
  error,
}: {
  error?: string | null;
  initialLoan: Loan;
  initialRefinances: WithID<Refinance>[];
  initialOneOffExtraPayments: WithID<OneOffExtraPayment>[];
  initialRecurringExtraPayments: WithID<RecurringExtraPayment>[];
  startingMonthAndYear: MonthAndYear;
  onSubmit: (data: {
    originalLoan: Loan;
    recurringExtraPayments: WithID<RecurringExtraPayment>[];
    oneOffExtraPayments: WithID<OneOffExtraPayment>[];
    refinances: WithID<Refinance>[];
  }) => void;
}) {
  const { originalLoan, setOriginalLoan } = useOriginalLoan(initialLoan);
  const {
    recurringExtraPayments,
    addRecurringExtraPayment,
    removeRecurringExtraPayment,
  } = useRecurringExtraPayments(
    arrayToMap(initialRecurringExtraPayments, ({ id }) => id),
  );
  const {
    oneOffExtraPayments,
    addOneOffExtraPayment,
    removeOneOffExtraPayment,
  } = useOneOffExtraPayments(
    arrayToMap(initialOneOffExtraPayments, ({ id }) => id),
  );
  const { refinances, addRefinance, removeRefinance } = useRefinances(
    arrayToMap(initialRefinances, ({ id }) => id),
  );

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
      <EditableItemField<Loan>
        itemName="Loan"
        item={originalLoan}
        onUpdate={(item) => {
          setOriginalLoan(item);
        }}
        renderItem={(item) => (
          <span>
            {`${formatUSD(item.principal)} @ `}
            {formatPercent(item.annualizedInterestRate, 3)} for {item.years}{' '}
            {plural('year', 'years', item.years)}
            {item.prePayment != null && item.prePayment !== 0
              ? ` with ${formatUSD(item.prePayment)} down`
              : ''}
          </span>
        )}
        renderEditFormFields={(draftItem, setDraftItem) => (
          <>
            <CurrencyField
              label="Amount financed"
              isRequired
              hasSelectOnFocus
              value={draftItem.principal}
              onChange={(principal) =>
                setDraftItem({ ...draftItem, principal })
              }
            />
            <NumberField
              label="Term"
              minValue={1}
              isRequired
              hasSelectOnFocus
              value={draftItem.years}
              onChange={(years) => setDraftItem({ ...draftItem, years })}
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
              value={draftItem.annualizedInterestRate}
              onChange={(annualizedInterestRate) =>
                setDraftItem({ ...draftItem, annualizedInterestRate })
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
              value={draftItem.prePayment}
              onChange={(prePayment) =>
                setDraftItem({ ...draftItem, prePayment })
              }
            />
          </>
        )}
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
