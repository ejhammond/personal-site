'use client';

import { Fragment, useState } from 'react';
import useOneOffExtraPaymentsParam from './use-one-off-extra-paymentsParam';
import useOriginalLoanParam from './use-original-loan-param';
import useRecurringExtraPaymentsParam from './use-recurring-extra-payments-param';
import useRefinancesParam from './use-refinances-param';
import useSaveParams from './use-save-params';
import {
  Amortizations,
  amortize,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';
import useAutoFocusRef from '@/ds/use-auto-focus';
import { Form } from '@/ds/form';
import { Button } from '@/ds/button';
import { NumberField } from '@/ds/number-field';
import Collection from '@/ds/collection';
import { createUniqueID, WithID } from '@/utils/id';
import { Checkbox } from '@/ds/checkbox';
import { formatUSD } from '@/utils/currency';
import { plural } from '@/utils/string';
import { VStack } from '@/ds/v-stack';
import React from 'react';
import AmortizationTable from './amortization-table';

function formatPercent(value: number, fractionDigits: number): string {
  return Intl.NumberFormat([], {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

function RecurringExtraPaymentFields({
  id,
  startingMonth,
  amount,
  set,
}: {
  id: string;
  startingMonth: number;
  amount: number;
  set: (recurringExtraPayment: WithID<RecurringExtraPayment>) => void;
}) {
  const autoFocusRef = useAutoFocusRef();

  return (
    <>
      <NumberField
        ref={autoFocusRef}
        label="Starting month"
        isRequired
        minValue={1}
        value={startingMonth}
        onChange={(value) => set({ id, amount, startingMonth: value })}
      />
      <NumberField
        label="Amount"
        isRequired
        minValue={0}
        value={amount}
        onChange={(value) => set({ id, amount: value, startingMonth })}
        formatOptions={{
          style: 'currency',
          currencySign: 'standard',
          currency: 'USD',
          currencyDisplay: 'symbol',
          maximumFractionDigits: 2,
        }}
      />
    </>
  );
}

function OneOffExtraPaymentFields({
  id,
  month,
  amount,
  set,
}: {
  id: string;
  month: number;
  amount: number;
  set: (oneOffExtraPayment: WithID<OneOffExtraPayment>) => void;
}) {
  const autoFocusRef = useAutoFocusRef();

  return (
    <>
      <NumberField
        ref={autoFocusRef}
        label="Month"
        isRequired
        minValue={0}
        value={month}
        onChange={(value) => set({ id, amount, month: value })}
      />
      <NumberField
        label="Amount"
        isRequired
        minValue={0}
        value={amount}
        onChange={(value) => set({ id, amount: value, month })}
        formatOptions={{
          style: 'currency',
          currencySign: 'standard',
          currency: 'USD',
          currencyDisplay: 'symbol',
          maximumFractionDigits: 2,
        }}
      />
    </>
  );
}

function RefinanceFields({
  id,
  month,
  principal,
  annualizedInterestRate,
  years,
  set,
}: {
  id: string;
  month: number;
  principal: number | null;
  annualizedInterestRate: number;
  years: number;
  set: (refinance: WithID<Refinance>) => void;
}) {
  const autoFocusRef = useAutoFocusRef();

  return (
    <>
      <NumberField
        ref={autoFocusRef}
        label="Month"
        isRequired
        minValue={0}
        value={month}
        onChange={(value) =>
          set({ id, principal, annualizedInterestRate, years, month: value })
        }
      />
      <NumberField
        label="Term"
        minValue={1}
        isRequired
        value={years}
        onChange={(value) =>
          set({ id, principal, annualizedInterestRate, years: value, month })
        }
        formatOptions={{
          style: 'unit',
          unit: 'year',
          unitDisplay: 'long',
        }}
      />
      <NumberField
        label="Rate"
        isRequired
        minValue={0}
        maxValue={1}
        value={annualizedInterestRate}
        onChange={(value) =>
          set({ id, principal, annualizedInterestRate: value, years, month })
        }
        formatOptions={{
          style: 'percent',
          minimumFractionDigits: 3,
        }}
      />
      <Checkbox
        isSelected={principal != null}
        onChange={(isChecked) => {
          if (isChecked) {
            set({ id, month, principal: NaN, annualizedInterestRate, years });
          } else {
            set({ id, month, principal: null, annualizedInterestRate, years });
          }
        }}
      >
        Specify exact amount?
      </Checkbox>
      {principal != null && (
        <NumberField
          label="Amount"
          minValue={1}
          value={principal ?? NaN}
          onChange={(value) =>
            set({ id, principal: value, annualizedInterestRate, years, month })
          }
          formatOptions={{
            style: 'currency',
            currencySign: 'standard',
            currency: 'USD',
            currencyDisplay: 'symbol',
            maximumFractionDigits: 0,
          }}
        />
      )}
    </>
  );
}
export default function Content() {
  const saveParams = useSaveParams();

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

  const [amortizations, setAmortizations] = useState<{
    base: Amortizations;
    withRefinances: Amortizations;
    withPrepayments: Amortizations;
  } | null>(null);

  const autoFocusRef = useAutoFocusRef();

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
    <>
      <Form
        onSubmit={(event) => {
          event.preventDefault();

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
            originalLoan,
            recurringExtraPayments,
            oneOffExtraPayments,
            refinances,
          });
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary">
              Calculate
            </Button>
          </div>
        }
      >
        <NumberField
          ref={autoFocusRef}
          label="Amount"
          isRequired
          minValue={1}
          value={originalLoan.principal}
          onChange={(principal) =>
            setOriginalLoan((p) => ({ ...p, principal }))
          }
          formatOptions={{
            style: 'currency',
            currencySign: 'standard',
            currency: 'USD',
            currencyDisplay: 'symbol',
            maximumFractionDigits: 0,
          }}
        />
        <NumberField
          label="Term"
          minValue={1}
          isRequired
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
        <Collection<WithID<RecurringExtraPayment>>
          itemName="Recurring extra payment"
          items={recurringExtraPayments}
          initializeDraftItem={() => ({
            id: createUniqueID(),
            amount: 100,
            startingMonth: 1,
          })}
          onAdd={addRecurringExtraPayment}
          onRemove={removeRecurringExtraPayment}
          renderEditFormFields={(draftItem, setDraftItem) => (
            <RecurringExtraPaymentFields
              id={draftItem.id}
              amount={draftItem.amount}
              startingMonth={draftItem.startingMonth}
              set={setDraftItem}
            />
          )}
          renderItem={(item) => (
            <span>
              {formatUSD(item.amount)}/month starting on month{' '}
              {item.startingMonth}
            </span>
          )}
        />
        <Collection<WithID<OneOffExtraPayment>>
          itemName="One-off extra payment"
          items={oneOffExtraPayments}
          initializeDraftItem={() => ({
            id: createUniqueID(),
            amount: 100,
            month: 1,
          })}
          onAdd={addOneOffExtraPayment}
          onRemove={removeOneOffExtraPayment}
          renderEditFormFields={(draftItem, setDraftItem) => (
            <OneOffExtraPaymentFields
              id={draftItem.id}
              amount={draftItem.amount}
              month={draftItem.month}
              set={setDraftItem}
            />
          )}
          renderItem={(item) => (
            <span>
              {formatUSD(item.amount)} on month {item.month}
            </span>
          )}
        />
        <Collection<WithID<Refinance>>
          itemName="Refinance"
          items={refinances}
          initializeDraftItem={() => ({
            id: createUniqueID(),
            month: 12,
            principal: null,
            annualizedInterestRate: 0.05,
            years: 30,
          })}
          onAdd={addRefinance}
          onRemove={removeRefinance}
          renderEditFormFields={(draftItem, setDraftItem) => (
            <RefinanceFields
              id={draftItem.id}
              month={draftItem.month}
              principal={draftItem.principal}
              annualizedInterestRate={draftItem.annualizedInterestRate}
              years={draftItem.years}
              set={setDraftItem}
            />
          )}
          renderItem={(item) => (
            <span>
              {formatPercent(item.annualizedInterestRate, 3)} for {item.years}{' '}
              {plural('year', 'years', item.years)} on month {item.month}
            </span>
          )}
        />
      </Form>
      <hr style={{ alignSelf: 'stretch', marginBlock: 16 }} />
      {savings?.refinance != null && refinances.length > 0 && (
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
      {savings?.prepayment != null &&
        (recurringExtraPayments.length > 0 ||
          oneOffExtraPayments.length > 0) && (
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
                <AmortizationTable amortization={amortization} />
              </Fragment>
            ),
          )}
        </VStack>
      )}
    </>
  );
}
