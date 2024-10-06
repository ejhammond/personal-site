import { Form } from '@/ds/form';
import useAutoFocusRef from '@/ds/use-auto-focus';
import { WithID } from '@/utils/id';
import {
  Loan,
  OneOffExtraPayment,
  RecurringExtraPayment,
  Refinance,
} from '@/utils/loan';
import useOriginalLoanParam from './use-original-loan-param';
import useRecurringExtraPaymentsParam from './use-recurring-extra-payments-param';
import useOneOffExtraPaymentsParam from './use-one-off-extra-paymentsParam';
import useRefinancesParam from './use-refinances-param';
import { Button } from '@/ds/button';
import { NumberField } from '@/ds/number-field';
import RecurringExtraPaymentsField from './recurring-extra-payments-field';
import OneOffExtraPaymentsField from './one-off-extra-payments-field';
import RefinancesField from './refinances-field';

export default function MortgageForm({
  onSubmit,
}: {
  onSubmit: (data: {
    originalLoan: Loan;
    recurringExtraPayments: WithID<RecurringExtraPayment>[];
    oneOffExtraPayments: WithID<OneOffExtraPayment>[];
    refinances: WithID<Refinance>[];
  }) => void;
}) {
  const autoFocusRef = useAutoFocusRef();

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

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit({
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
        onChange={(principal) => setOriginalLoan((p) => ({ ...p, principal }))}
        formatOptions={{
          style: 'currency',
          currencySign: 'standard',
          currency: 'USD',
          currencyDisplay: 'symbol',
          maximumFractionDigits: 2,
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
      <RecurringExtraPaymentsField
        items={recurringExtraPayments}
        add={addRecurringExtraPayment}
        remove={removeRecurringExtraPayment}
      />
      <OneOffExtraPaymentsField
        items={oneOffExtraPayments}
        add={addOneOffExtraPayment}
        remove={removeOneOffExtraPayment}
      />
      <RefinancesField
        items={refinances}
        add={addRefinance}
        remove={removeRefinance}
      />
    </Form>
  );
}