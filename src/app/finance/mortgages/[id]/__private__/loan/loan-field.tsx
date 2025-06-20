import { CurrencyField } from '@/ds/currency-field';
import EditableItemField from '@/ds/editable-item-field';
import { Form } from '@/ds/form';
import FormFooter from '@/ds/form/footer';
import { NumberField } from '@/ds/number-field';
import { formatUSD } from '@/utils/currency';
import { Loan } from '@/utils/loan';
import { formatPercent } from '@/utils/number';
import { plural } from '@/utils/string';
import { optimisticPending, WithOptimistic } from '@/utils/with-optimistic';
import { useOptimistic, useState } from 'react';
import { updateLoan, UpdateLoanActionState } from './loan-actions';
import MonthAndYearField from '@/ds/month-and-year-field';
import { monthToNumber } from '@/utils/date';

export default function LoanField({
  loan,
  loanID,
}: {
  loanID: string;
  loan: Loan;
}) {
  const [optimisticLoan, setOptimisticLoan] = useOptimistic<
    WithOptimistic<Loan>,
    Loan
  >(loan, (_prev, next) => optimisticPending(next));

  const [updateState, setUpdateState] = useState<UpdateLoanActionState>({});
  const [updateIsPending, setUpdateIsPending] = useState<boolean>(false);

  return (
    <EditableItemField<WithOptimistic<Loan>>
      isPending={optimisticLoan.isPending}
      hasError={updateState.errors != null}
      itemName="Loan"
      item={optimisticLoan}
      renderItem={(item, { isPending }) => (
        <span
          style={{
            color: isPending ? 'var(--text-color-disabled)' : 'inherit',
          }}
        >
          {`${item.start.month} ${item.start.year} - `}
          {`${formatUSD(item.principal)} @ `}
          {formatPercent(item.annualizedInterestRate, 3)} for {item.term}{' '}
          {plural('year', 'years', item.term)}
          {item.prePayment != null && item.prePayment !== 0
            ? ` with ${formatUSD(item.prePayment)} down`
            : ''}
        </span>
      )}
      renderEditForm={({ draftItem, setDraftItem, close }) => (
        <Form
          id="update-loan-form"
          isPending={updateIsPending}
          action={async () => {
            setOptimisticLoan(draftItem);

            setUpdateIsPending(true);
            setUpdateState({});
            const state = await updateLoan(
              {
                principal: draftItem.principal,
                term: draftItem.term,
                annualized_interest_rate: draftItem.annualizedInterestRate,
                month: monthToNumber(draftItem.start.month),
                year: draftItem.start.year,
                pre_payment: draftItem.prePayment,
              },
              {
                id: parseInt(loanID, 10),
              },
            );
            setUpdateState(state);
            setUpdateIsPending(false);
          }}
          onSubmit={() => {
            close();
          }}
          footer={<FormFooter errorMessage={updateState.errors?.form} />}
          validationErrors={updateState.errors}
        >
          <MonthAndYearField
            label="Starting date"
            description="Month when the first payment is due"
            isRequired
            hasSelectOnFocus
            value={draftItem.start}
            onChange={(start) => setDraftItem({ ...draftItem, start })}
          />
          <CurrencyField
            name="principal"
            label="Amount financed"
            isRequired
            hasSelectOnFocus
            value={draftItem.principal}
            onChange={(principal) => setDraftItem({ ...draftItem, principal })}
          />
          <NumberField
            name="term"
            label="Term"
            minValue={1}
            isRequired
            hasSelectOnFocus
            value={draftItem.term}
            onChange={(term) => setDraftItem({ ...draftItem, term })}
            formatOptions={{
              style: 'unit',
              unit: 'year',
              unitDisplay: 'long',
            }}
          />
          <NumberField
            name="rate"
            label="Rate"
            isRequired
            hasSelectOnFocus
            minValue={0}
            maxValue={1}
            value={draftItem.annualizedInterestRate}
            onChange={(annualizedInterestRate) =>
              setDraftItem({ ...draftItem, annualizedInterestRate })
            }
            formatOptions={{
              style: 'percent',
              minimumFractionDigits: 3,
            }}
          />
          <CurrencyField
            name="prePayment"
            label="Pre payment"
            description="Extra payment after down payment and before the first month's payment"
            hasSelectOnFocus
            value={draftItem.prePayment}
            onChange={(prePayment) =>
              setDraftItem({ ...draftItem, prePayment })
            }
          />
        </Form>
      )}
    />
  );
}
