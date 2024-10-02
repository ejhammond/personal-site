'use client';

import { Form } from '@/ds/form';
import { NumberField } from '@/ds/number-field';
import { Column, Row, Table, TableHeader } from '@/ds/table';
import { getMortgagePayoff } from 'mortgage';
import { useState } from 'react';
import { TableBody } from 'react-aria-components';

export default function Mortgage() {
  const [amount, setAmount] = useState(100000);
  const [term, setTerm] = useState(30);
  const [rate, setRate] = useState(0.055);

  const termMonths = term * 12;

  const payoff = getMortgagePayoff(amount, rate, termMonths);

  return (
    <>
      <h2>Mortgage Calculator</h2>
      <Form>
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
      </Form>
      <Table
        aria-label="Loan amortization schedule"
        style={{
          marginBlockStart: 32,
          fontFamily: 'var(--global-font-monospace)',
        }}
      >
        <TableHeader>
          <Column isRowHeader>Month</Column>
          <Column>Principal</Column>
          <Column>Interest</Column>
          <Column>Balance</Column>
        </TableHeader>
        <TableBody>
          {Array.from({ length: term * 12 }).map((_, month) => {
            return (
              <Row key={month}>
                <Column>{month}</Column>
                <Column>${payoff.data[month].principal.toFixed(2)}</Column>
                <Column>${payoff.data[month].interest.toFixed(2)}</Column>
                <Column>${payoff.data[month].balance.toFixed(2)}</Column>
              </Row>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
