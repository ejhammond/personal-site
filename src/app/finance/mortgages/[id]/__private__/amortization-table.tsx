import { Column, Row, Table, TableHeader } from '@/ds/table';
import { formatUSD } from '@/utils/currency';
import { addMonths, MonthAndYear } from '@/utils/date';
import { Amortization, Loan } from '@/utils/loan';
import { TableBody } from 'react-aria-components';

export default function AmortizationTable({
  loan,
  amortization,
  originalLoanStart,
}: {
  loan: Loan;
  amortization: Amortization;
  originalLoanStart: MonthAndYear;
}) {
  return (
    <div className="mortgage-table">
      <Table aria-label="Loan amortization schedule">
        <TableHeader>
          <Column isRowHeader>Date</Column>
          <Column>Payment</Column>
          <Column>Interest</Column>
          <Column>Principal</Column>
          <Column>Extra</Column>
          <Column>Balance</Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Column></Column>
            <Column>
              {loan.prePayment !== 0 && formatUSD(loan.prePayment)}
            </Column>
            <Column></Column>
            <Column></Column>
            <Column>
              {loan.prePayment !== 0 && formatUSD(loan.prePayment)}
            </Column>
            <Column>{formatUSD(loan.principal - loan.prePayment)}</Column>
          </Row>
          {amortization.map(
            (
              {
                month,
                interest,
                principal,
                balance,
                extra,
                refinanceDisbursement = 0,
              },
              index,
            ) => {
              const monthAndYear = addMonths(originalLoanStart, month);

              return (
                <Row
                  key={month}
                  style={{
                    background: index % 2 === 0 ? 'var(--gray-100)' : undefined,
                  }}
                >
                  <Column>
                    {monthAndYear.year} {monthAndYear.month}
                  </Column>
                  <Column>
                    {formatUSD(
                      interest + principal + extra + refinanceDisbursement,
                    )}
                  </Column>
                  <Column>{formatUSD(interest)}</Column>
                  <Column>{formatUSD(principal)}</Column>
                  <Column>
                    {extra + refinanceDisbursement !== 0 &&
                      formatUSD(extra + refinanceDisbursement)}
                  </Column>
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
