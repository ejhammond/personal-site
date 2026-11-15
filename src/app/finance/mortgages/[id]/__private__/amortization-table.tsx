import { Table, proportional } from '@astryxdesign/core/Table';
import type { TableColumn } from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';
import { formatUSD } from '@/utils/currency';
import { addMonths, MonthAndYear } from '@/utils/date';
import { Amortization, Loan } from '@/utils/loan';

type AmortizationRow = {
  key: string;
  date: string;
  payment: string;
  interest: string;
  principal: string;
  extra: string;
  balance: string;
};

const columns: TableColumn<AmortizationRow>[] = [
  {
    key: 'date',
    header: 'Date',
    width: proportional(2),
    renderCell: (item) => <Text hasTabularNumbers>{item.date}</Text>,
  },
  {
    key: 'payment',
    header: 'Payment',
    width: proportional(1),
    align: 'end',
    renderCell: (item) => <Text hasTabularNumbers>{item.payment}</Text>,
  },
  {
    key: 'interest',
    header: 'Interest',
    width: proportional(1),
    align: 'end',
    renderCell: (item) => <Text hasTabularNumbers>{item.interest}</Text>,
  },
  {
    key: 'principal',
    header: 'Principal',
    width: proportional(1),
    align: 'end',
    renderCell: (item) => <Text hasTabularNumbers>{item.principal}</Text>,
  },
  {
    key: 'extra',
    header: 'Extra',
    width: proportional(1),
    align: 'end',
    renderCell: (item) => <Text hasTabularNumbers>{item.extra}</Text>,
  },
  {
    key: 'balance',
    header: 'Balance',
    width: proportional(1),
    align: 'end',
    renderCell: (item) => <Text hasTabularNumbers>{item.balance}</Text>,
  },
];

export default function AmortizationTable({
  loan,
  amortization,
  originalLoanStart,
}: {
  loan: Loan;
  amortization: Amortization;
  originalLoanStart: MonthAndYear;
}) {
  const rows: AmortizationRow[] = [
    {
      key: 'pre-payment',
      date: '',
      payment: loan.prePayment !== 0 ? formatUSD(loan.prePayment) : '',
      interest: '',
      principal: '',
      extra: loan.prePayment !== 0 ? formatUSD(loan.prePayment) : '',
      balance: formatUSD(loan.principal - loan.prePayment),
    },
    ...amortization.map(
      ({
        month,
        interest,
        principal,
        balance,
        extra,
        refinanceDisbursement = 0,
      }) => {
        const monthAndYear = addMonths(originalLoanStart, month);

        return {
          key: month.toString(),
          date: `${monthAndYear.year} ${monthAndYear.month}`,
          payment: formatUSD(
            interest + principal + extra + refinanceDisbursement,
          ),
          interest: formatUSD(interest),
          principal: formatUSD(principal),
          extra:
            extra + refinanceDisbursement !== 0
              ? formatUSD(extra + refinanceDisbursement)
              : '',
          balance: formatUSD(balance),
        };
      },
    ),
  ];

  return (
    <Table
      aria-label="Loan amortization schedule"
      data={rows}
      columns={columns}
      idKey="key"
      density="balanced"
      dividers="none"
      hasHover
      textOverflow="truncate"
    />
  );
}
