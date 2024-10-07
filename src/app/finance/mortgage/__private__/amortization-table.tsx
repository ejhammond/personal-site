import { Column, Row, Table, TableHeader } from '@/ds/table';
import { formatUSD } from '@/utils/currency';
import { addMonths, MonthAndYear } from '@/utils/date';
import { Amortization } from '@/utils/loan';
import { TableBody } from 'react-aria-components';

export default function AmortizationTable({
  startingMonthAndYear,
  amortization,
}: {
  startingMonthAndYear: MonthAndYear;
  amortization: Amortization;
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
          {amortization.map(
            ({
              month,
              interest,
              principal,
              balance,
              extra,
              refinanceDisbursement = 0,
            }) => {
              const monthAndYear = addMonths(startingMonthAndYear, month);

              return (
                <Row key={month}>
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
                  <Column>{formatUSD(extra + refinanceDisbursement)}</Column>
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
