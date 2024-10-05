'use client';

import { NumberField } from '@/ds/number-field';
import { Column, Row, Table, TableHeader } from '@/ds/table';
import { useCallback, useState } from 'react';
import { TableBody } from 'react-aria-components';

import './page.css';
import {
  Amortization,
  amortize,
  OneOffExtraPayment,
  RecurringExtraPayment,
} from '@/utils/loan';
import { HStack } from '@/ds/h-stack';
import { Button } from '@/ds/button';
import { createUniqueID, WithID } from '@/utils/id';
import { removeFromMap, setInMap, sortMap } from '@/utils/map';
import { VStack } from '@/ds/v-stack';
import Collection from '@/ds/collection';

function formatUSD(value: number): string {
  return Intl.NumberFormat([], {
    style: 'currency',
    currencySign: 'standard',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(value);
}

function RecurringExtraPaymentForm({
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
  return (
    <HStack vAlign="end" wrap="wrap" gap="sm">
      <NumberField
        label="Starting month"
        minValue={1}
        value={startingMonth}
        onChange={(value) => set({ id, amount, startingMonth: value })}
      />
      <NumberField
        label="Amount"
        minValue={0}
        value={amount}
        onChange={(value) => set({ id, amount: value, startingMonth })}
        formatOptions={{
          style: 'currency',
          currencySign: 'standard',
          currency: 'USD',
          currencyDisplay: 'symbol',
          maximumFractionDigits: 0,
        }}
      />
    </HStack>
  );
}

function OneOffExtraPaymentForm({
  id,
  month,
  amount,
  set,
}: {
  id: string;
  month: number;
  amount: number;
  set: (recurringExtraPayment: WithID<OneOffExtraPayment>) => void;
}) {
  return (
    <HStack vAlign="end" wrap="wrap" gap="sm">
      <NumberField
        label="Month"
        minValue={0}
        value={month}
        onChange={(value) => set({ id, amount, month: value })}
      />
      <NumberField
        label="Amount"
        minValue={0}
        value={amount}
        onChange={(value) => set({ id, amount: value, month })}
        formatOptions={{
          style: 'currency',
          currencySign: 'standard',
          currency: 'USD',
          currencyDisplay: 'symbol',
          maximumFractionDigits: 0,
        }}
      />
    </HStack>
  );
}

export default function Mortgage() {
  const [amount, setAmount] = useState(100000);
  const [term, setTerm] = useState(30);
  const [rate, setRate] = useState(0.055);

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

  const [amortization, setAmortization] = useState<{
    expected: Amortization;
    actual: Amortization;
  } | null>(null);

  const moneySaved =
    amortization != null
      ? amortization.expected.reduce((acc, { interest }) => acc + interest, 0) -
        amortization.actual.reduce((acc, { interest }) => acc + interest, 0)
      : 0;

  return (
    <>
      <h2>Mortgage Calculator</h2>
      <VStack gap="md" hAlign="start">
        <NumberField
          label="Amount"
          minValue={0}
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
          minValue={0}
          maxValue={1}
          value={rate}
          onChange={setRate}
          formatOptions={{
            style: 'percent',
            minimumFractionDigits: 2,
          }}
        />
        <Collection<RecurringExtraPayment & { id: string }>
          itemName="Recurring extra payment"
          items={Array.from(recurringExtraPayments.values())}
          initializeDraftItem={() => ({
            id: createUniqueID(),
            amount: 100,
            startingMonth: 1,
          })}
          onAdd={addRecurringExtraPayment}
          onRemove={removeRecurringExtraPayment}
          renderEditForm={(draftItem, setDraftItem) => (
            <RecurringExtraPaymentForm
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
          renderEditForm={(draftItem, setDraftItem) => (
            <OneOffExtraPaymentForm
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
        <hr style={{ alignSelf: 'stretch', marginBlock: 16 }} />
        <Button
          onPress={() => {
            // sort the extra payments in the ui to tidy up
            setRecurringExtraPayments((p) =>
              sortMap(p, (a, b) => a.startingMonth - b.startingMonth),
            );

            setAmortization({
              expected: amortize({
                loan: {
                  principal: amount,
                  annualizedInterestRate: rate,
                  years: term,
                },
              }),
              actual: amortize({
                loan: {
                  principal: amount,
                  annualizedInterestRate: rate,
                  years: term,
                },
                recurringExtraPayments: Array.from(
                  recurringExtraPayments.values(),
                ),
                oneOffExtraPayments: Array.from(oneOffExtraPayments.values()),
              }),
            });
          }}
        >
          Calculate
        </Button>
        {moneySaved > 0 && <strong>Saved {formatUSD(moneySaved)}</strong>}
      </VStack>
      {amortization != null && (
        <div id="mortgage-table">
          <Table aria-label="Loan amortization schedule">
            <TableHeader>
              <Column isRowHeader>Month</Column>
              <Column>Interest</Column>
              <Column>Principal</Column>
              <Column>Extra</Column>
              <Column>Balance</Column>
            </TableHeader>
            <TableBody>
              {amortization.actual.map(
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
      )}
    </>
  );
}
