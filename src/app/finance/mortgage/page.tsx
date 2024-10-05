'use client';

import { NumberField } from '@/ds/number-field';
import { Column, Row, Table, TableHeader } from '@/ds/table';
import React, { useCallback, useState } from 'react';
import { TableBody } from 'react-aria-components';

import './page.css';
import {
  Amortization,
  Amortizations,
  amortize,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';
import { Button } from '@/ds/button';
import { createUniqueID, WithID } from '@/utils/id';
import { removeFromMap, setInMap, sortMap } from '@/utils/map';
import Collection from '@/ds/collection';
import { Form } from '@/ds/form';
import useAutoFocusRef from '@/ds/useAutoFocus';
import { VStack } from '@/ds/v-stack';
import { plural } from '@/utils/string';
import { Checkbox } from '@/ds/checkbox';

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

  const [isPrincipalSpecified, setIsPrincipalSpecified] = useState(false);

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
        isSelected={isPrincipalSpecified}
        onChange={setIsPrincipalSpecified}
      >
        Specify exact amount?
      </Checkbox>
      {isPrincipalSpecified && (
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
  const [amount, setAmount] = useState<number>(100000);
  const [term, setTerm] = useState<number>(30);
  const [rate, setRate] = useState<number>(0.055);

  const [recurringExtraPayments, setRecurringExtraPayments] = useState<
    ReadonlyMap<string, WithID<RecurringExtraPayment>>
  >(new Map());

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

  const [oneOffExtraPayments, setOneOffExtraPayments] = useState<
    ReadonlyMap<string, WithID<OneOffExtraPayment>>
  >(new Map());

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

  const [refinances, setRefinances] = useState<
    ReadonlyMap<string, WithID<Refinance>>
  >(new Map());

  const addRefinance = useCallback((refinance: WithID<Refinance>) => {
    setRefinances((p) => setInMap(p, refinance.id, refinance));
  }, []);

  const removeRefinance = useCallback((id: string) => {
    setRefinances((p) => removeFromMap(p, id));
  }, []);

  const [amortizations, setAmortizations] = useState<{
    expected: Amortizations;
    actual: Amortizations;
  } | null>(null);

  const autoFocusRef = useAutoFocusRef();

  const moneySaved =
    amortizations != null
      ? amortizations.expected
          .flatMap(({ amortization }) =>
            amortization.map(({ interest }) => interest),
          )
          .reduce((acc, interest) => acc + interest, 0) -
        amortizations.actual
          .flatMap(({ amortization }) =>
            amortization.map(({ interest }) => interest),
          )
          .reduce((acc, interest) => acc + interest, 0)
      : 0;

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

          setAmortizations({
            expected: amortize({
              originalLoan: {
                principal: amount,
                annualizedInterestRate: rate,
                years: term,
              },
              refinances: Array.from(refinances.values()),
            }),
            actual: amortize({
              originalLoan: {
                principal: amount,
                annualizedInterestRate: rate,
                years: term,
              },
              recurringExtraPayments: Array.from(
                recurringExtraPayments.values(),
              ),
              oneOffExtraPayments: Array.from(oneOffExtraPayments.values()),
              refinances: Array.from(refinances.values()),
            }),
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
          items={Array.from(recurringExtraPayments.values())}
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
          items={Array.from(oneOffExtraPayments.values())}
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
          items={Array.from(refinances.values())}
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
      {moneySaved > 0 && (
        <>
          <h3>Savings due to prepayments</h3>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'var(--highlight-foreground)',
            }}
          >
            {formatUSD(moneySaved)}
          </span>
        </>
      )}
      {amortizations != null && amortizations.actual.length > 0 && (
        <VStack gap="md" hAlign="stretch">
          {amortizations.actual.map(({ loan, amortization }, index) => (
            <React.Fragment key={index}>
              <h3>
                Loan {index + 1} - {formatUSD(loan.principal)} at{' '}
                {formatPercent(loan.annualizedInterestRate, 3)} for {loan.years}{' '}
                {plural('year', 'years', loan.years)}
              </h3>
              <AmortizationTable amortization={amortization} />
            </React.Fragment>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
