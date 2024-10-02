'use client';

import { Form } from '@/ds/form';
import { NumberField } from '@/ds/number-field';
import { Column, Row, Table, TableHeader } from '@/ds/table';
import { getMortgagePayoff } from 'mortgage';
import { useState } from 'react';
import { TableBody } from 'react-aria-components';

import './page.css';

function formatUSD(value: number): string {
  return Intl.NumberFormat([], {
    style: 'currency',
    currencySign: 'standard',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(value);
}

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
      <div id="mortgage-table">
        <Table aria-label="Loan amortization schedule">
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
                  <Column>{formatUSD(payoff.data[month].principal)}</Column>
                  <Column>{formatUSD(payoff.data[month].interest)}</Column>
                  <Column>{formatUSD(payoff.data[month].balance)}</Column>
                </Row>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
