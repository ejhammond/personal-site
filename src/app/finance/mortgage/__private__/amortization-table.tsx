import { Column, Row, Table, TableHeader } from '@/ds/table';
import { formatUSD } from '@/utils/currency';
import { Amortization } from '@/utils/loan';
import { TableBody } from 'react-aria-components';

export default function AmortizationTable({
  amortization,
}: {
  amortization: Amortization;
}) {
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
