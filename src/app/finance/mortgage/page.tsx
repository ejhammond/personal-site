'use client';

import { NumberField } from '@/ds/number-field';
import { Column, Row, Table, TableHeader } from '@/ds/table';
import React, { useCallback, useState } from 'react';
import { TableBody } from 'react-aria-components';
import { z } from 'zod';
import './page.css';
import {
  Amortization,
  Amortizations,
  amortize,
  Loan,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';
import { Button } from '@/ds/button';
import { createUniqueID, WithID } from '@/utils/id';
import { arrayToMap, removeFromMap, setInMap, sortMap } from '@/utils/map';
import Collection from '@/ds/collection';
import { Form } from '@/ds/form';
import useAutoFocusRef from '@/ds/useAutoFocus';
import { VStack } from '@/ds/v-stack';
import { plural } from '@/utils/string';
import { Checkbox } from '@/ds/checkbox';
import { useSearchParams, usePathname } from 'next/navigation';

const originalLoanSchema = z.object({
  principal: z.number().positive().optional(),
  annualizedInterestRate: z.number().positive().max(1).optional(),
  years: z.number().positive().optional(),
});

const recurringExtraPaymentSchema = z.object({
  id: z.string(),
  startingMonth: z.number().positive(),
  amount: z.number().positive(),
});

const oneOffExtraPaymentSchema = z.object({
  id: z.string(),
  month: z.number().positive(),
  amount: z.number().positive(),
});

const refinanceSchema = z.object({
  id: z.string(),
  principal: z.number().positive().nullable(),
  annualizedInterestRate: z.number().positive().max(1),
  years: z.number().positive(),
  month: z.number().positive(),
});

function deserializeParams(params: URLSearchParams): {
  originalLoan: Partial<Loan>;
  recurringExtraPayments: WithID<RecurringExtraPayment>[];
  oneOffExtraPayments: WithID<OneOffExtraPayment>[];
  refinances: WithID<Refinance>[];
} | null {
  const version = params.get('dataVersion');

  if (version == null) {
    return null;
  }

  const data = params.get('data');

  if (data == null) {
    return null;
  }

  const parsed = JSON.parse(data);

  const originalLoan = originalLoanSchema.safeParse(parsed.originalLoan);
  const recurringExtraPayments = z
    .array(recurringExtraPaymentSchema)
    .safeParse(parsed.recurringExtraPayments);
  const oneOffExtraPayments = z
    .array(oneOffExtraPaymentSchema)
    .safeParse(parsed.oneOffExtraPayments);
  const refinances = z.array(refinanceSchema).safeParse(parsed.refinances);

  return {
    originalLoan: originalLoan.success ? originalLoan.data : {},
    recurringExtraPayments: recurringExtraPayments.success
      ? recurringExtraPayments.data
      : [],
    oneOffExtraPayments: oneOffExtraPayments.success
      ? oneOffExtraPayments.data
      : [],
    refinances: refinances.success ? refinances.data : [],
  };
}

function serializeParams({
  originalLoan,
  recurringExtraPayments,
  oneOffExtraPayments,
  refinances,
}: {
  originalLoan: Loan;
  recurringExtraPayments: RecurringExtraPayment[];
  oneOffExtraPayments: OneOffExtraPayment[];
  refinances: Refinance[];
}) {
  return new URLSearchParams({
    dataVersion: '1',
    data: JSON.stringify({
      originalLoan,
      recurringExtraPayments,
      oneOffExtraPayments,
      refinances,
    }),
  });
}

function formatUSD(value: number): string {
  return Intl.NumberFormat([], {
    style: 'currency',
    currencySign: 'standard',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(value);
}

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

function AmortizationTable({ amortization }: { amortization: Amortization }) {
  return (
    <div className="mortgage-table">
      <Table aria-label="Loan amortization schedule">
        <TableHeader>
          <Column isRowHeader>Month</Column>
          <Column>Interest</Column>
          <Column>Principal</Column>
          <Column>Extra</Column>
          <Column>Balance</Column>
        </TableHeader>
        <TableBody>
          {amortization.map(
            ({ month, interest, principal, balance, extra }) => {
              return (
                <Row key={month}>
                  <Column>{month}</Column>
                  <Column>{formatUSD(interest)}</Column>
                  <Column>{formatUSD(principal)}</Column>
                  <Column>{formatUSD(extra)}</Column>
                  <Column>{formatUSD(balance)}</Column>
                </Row>
              );
            },
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Mortgage() {
  const params = useSearchParams();
  const pathname = usePathname();

  const paramInputs = deserializeParams(params);

  const [amount, setAmount] = useState<number>(
    paramInputs?.originalLoan?.principal ?? 100000,
  );
  const [term, setTerm] = useState<number>(
    paramInputs?.originalLoan?.years ?? 30,
  );
  const [rate, setRate] = useState<number>(
    paramInputs?.originalLoan?.annualizedInterestRate ?? 0.055,
  );

  const [recurringExtraPaymentsMap, setRecurringExtraPayments] = useState<
    ReadonlyMap<string, WithID<RecurringExtraPayment>>
  >(arrayToMap(paramInputs?.recurringExtraPayments ?? [], ({ id }) => id));

  const addRecurringExtraPayment = useCallback(
    (recurringExtraPayment: WithID<RecurringExtraPayment>) => {
      setRecurringExtraPayments((p) =>
        setInMap(p, recurringExtraPayment.id, recurringExtraPayment),
      );
    },
    [],
  );

  const removeRecurringExtraPayment = useCallback((id: string) => {
    setRecurringExtraPayments((p) => removeFromMap(p, id));
  }, []);

  const [oneOffExtraPaymentsMap, setOneOffExtraPayments] = useState<
    ReadonlyMap<string, WithID<OneOffExtraPayment>>
  >(arrayToMap(paramInputs?.oneOffExtraPayments ?? [], ({ id }) => id));

  const addOneOffExtraPayment = useCallback(
    (oneOffExtraPayment: WithID<OneOffExtraPayment>) => {
      setOneOffExtraPayments((p) =>
        setInMap(p, oneOffExtraPayment.id, oneOffExtraPayment),
      );
    },
    [],
  );

  const removeOneOffExtraPayment = useCallback((id: string) => {
    setOneOffExtraPayments((p) => removeFromMap(p, id));
  }, []);

  const [refinancesMap, setRefinances] = useState<
    ReadonlyMap<string, WithID<Refinance>>
  >(arrayToMap(paramInputs?.refinances ?? [], ({ id }) => id));

  const addRefinance = useCallback((refinance: WithID<Refinance>) => {
    setRefinances((p) => setInMap(p, refinance.id, refinance));
  }, []);

  const removeRefinance = useCallback((id: string) => {
    setRefinances((p) => removeFromMap(p, id));
  }, []);

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
    <VStack gap="md">
      <h2>Mortgage Calculator</h2>
      <Form
        onSubmit={(event) => {
          event.preventDefault();

          // sort the collections to tidy up the ui
          setRecurringExtraPayments((p) =>
            sortMap(p, (a, b) => a.startingMonth - b.startingMonth),
          );

          setOneOffExtraPayments((p) =>
            sortMap(p, (a, b) => a.month - b.month),
          );

          setOneOffExtraPayments((p) =>
            sortMap(p, (a, b) => a.month - b.month),
          );

          const originalLoan = {
            principal: amount,
            annualizedInterestRate: rate,
            years: term,
          };
          const recurringExtraPayments = Array.from(
            recurringExtraPaymentsMap.values(),
          );
          const oneOffExtraPayments = Array.from(
            oneOffExtraPaymentsMap.values(),
          );
          const refinances = Array.from(refinancesMap.values());

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

          const params = serializeParams({
            originalLoan,
            recurringExtraPayments,
            oneOffExtraPayments,
            refinances,
          });

          window.history.pushState(
            null, // data
            '', // "unused"
            pathname + '?' + params.toString(),
          );
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
          value={amount}
          onChange={setAmount}
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
          value={term}
          onChange={setTerm}
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
          value={rate}
          onChange={setRate}
          formatOptions={{
            style: 'percent',
            minimumFractionDigits: 3,
          }}
        />
        <Collection<WithID<RecurringExtraPayment>>
          itemName="Recurring extra payment"
          items={Array.from(recurringExtraPaymentsMap.values())}
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
          items={Array.from(oneOffExtraPaymentsMap.values())}
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
          items={Array.from(refinancesMap.values())}
          initializeDraftItem={() => ({
            id: createUniqueID(),
            month: 12,
            principal: 100000,
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
      {savings?.refinance != null && refinancesMap.size > 0 && (
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
        (recurringExtraPaymentsMap.size > 0 ||
          oneOffExtraPaymentsMap.size > 0) && (
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
              <React.Fragment key={index}>
                <h3>
                  Loan {index + 1} - {formatUSD(loan.principal)} at{' '}
                  {formatPercent(loan.annualizedInterestRate, 3)} for{' '}
                  {loan.years} {plural('year', 'years', loan.years)}
                </h3>
                <AmortizationTable amortization={amortization} />
              </React.Fragment>
            ),
          )}
        </VStack>
      )}
    </VStack>
  );
}
