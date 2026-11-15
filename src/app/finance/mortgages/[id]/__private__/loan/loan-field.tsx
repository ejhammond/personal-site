'use client';

import {CurrencyInput} from '@/components/currency-input';
import {
  EditableCard,
  EditableItemField,
} from '@/components/editable-collection';
import {FormFooter} from '@/components/form-footer';
import {MonthAndYearInput} from '@/components/month-and-year-input';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {VStack} from '@astryxdesign/core/Stack';
import {formatUSD} from '@/utils/currency';
import {Loan} from '@/utils/loan';
import {formatPercent} from '@/utils/number';
import {plural} from '@/utils/string';
import {optimisticPending, WithOptimistic} from '@/utils/with-optimistic';
import {useOptimistic, useState} from 'react';
import {updateLoan, UpdateLoanActionState} from './loan-actions';
import {monthToNumber} from '@/utils/date';

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
      itemName="Loan"
      item={optimisticLoan}
      renderItem={(item, {edit}) => (
        <EditableCard isPending={updateIsPending} onEdit={edit}>
          <MetadataList>
            <MetadataListItem label="Date">
              {`${item.start.month} ${item.start.year}`}
            </MetadataListItem>
            <MetadataListItem label="Principal">
              {formatUSD(item.principal)}
            </MetadataListItem>
            <MetadataListItem label="Term">
              {`${item.term} ${plural('year', 'years', item.term)}`}
            </MetadataListItem>
            <MetadataListItem label="Rate">
              {formatPercent(item.annualizedInterestRate, 3)}
            </MetadataListItem>
            {item.prePayment !== 0 && (
              <MetadataListItem label="Down">
                {formatUSD(item.prePayment)}
              </MetadataListItem>
            )}
          </MetadataList>
        </EditableCard>
      )}
      renderEditForm={({draftItem, setDraftItem, close}) => (
        <form
          id="update-loan-form"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
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
            })();
            close();
          }}
        >
          <VStack gap={3}>
            <MonthAndYearInput
              label="Starting date"
              description="Month when the first payment is due"
              isRequired
              value={draftItem.start}
              onChange={(start) => setDraftItem({...draftItem, start})}
            />
            <CurrencyInput
              htmlName="principal"
              label="Amount financed"
              isRequired
              value={draftItem.principal}
              onChange={(principal) =>
                setDraftItem({...draftItem, principal})
              }
            />
            <NumberInput
              htmlName="term"
              label="Term"
              min={1}
              isRequired
              isIntegerOnly
              value={draftItem.term}
              onChange={(term) => setDraftItem({...draftItem, term})}
              formatValue={(term) =>
                `${term} ${plural('year', 'years', term)}`
              }
            />
            <NumberInput
              htmlName="rate"
              label="Rate"
              isRequired
              min={0}
              max={1}
              step={0.001}
              value={draftItem.annualizedInterestRate}
              onChange={(annualizedInterestRate) =>
                setDraftItem({...draftItem, annualizedInterestRate})
              }
              formatValue={(rate) => formatPercent(rate, 3)}
            />
            <CurrencyInput
              htmlName="prePayment"
              label="Pre payment"
              description="Extra payment after down payment and before the first month's payment"
              value={draftItem.prePayment}
              onChange={(prePayment) =>
                setDraftItem({...draftItem, prePayment})
              }
            />
            <FormFooter
              isPending={updateIsPending}
              errorMessage={updateState.errors?.form}
              onCancel={close}
            />
          </VStack>
        </form>
      )}
    />
  );
}
