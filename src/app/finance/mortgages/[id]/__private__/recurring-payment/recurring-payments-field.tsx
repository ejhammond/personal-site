'use client';

import {createUniqueID, WithID} from '@/utils/id';
import {RecurringPayment} from '@/utils/loan';
import {MonthAndYearInput} from '@/components/month-and-year-input';
import {addMonths, MonthAndYear, monthDifference} from '@/utils/date';
import {CurrencyInput} from '@/components/currency-input';
import {formatUSD} from '@/utils/currency';
import {
  CollectionField,
  EditableCard,
} from '@/components/editable-collection';
import {FormFooter} from '@/components/form-footer';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {VStack} from '@astryxdesign/core/Stack';
import {startTransition, useOptimistic, useState} from 'react';
import {optimisticPending, WithOptimistic} from '@/utils/with-optimistic';
import {mapToArray, removeFromMap, setInMap} from '@/utils/map';
import {
  deleteRecurringPayment,
  insertRecurringPayment,
  updateRecurringPayment,
  UpdateRecurringPaymentActionState,
} from './recurring-payment-actions';

export default function RecurringPaymentsField({
  defaultMonth = 1,
  startingMonthAndYear,
  items,
  loanID,
}: {
  loanID: string;
  defaultMonth?: number;
  startingMonthAndYear: MonthAndYear;
  items: ReadonlyMap<string, WithID<RecurringPayment>>;
}) {
  const [optimisticRecurringPayments, dispatchOptimistic] = useOptimistic<
    ReadonlyMap<string, WithOptimistic<WithID<RecurringPayment>>>,
    | {type: 'upsert'; item: WithID<RecurringPayment>}
    | {type: 'delete'; id: string}
  >(items, (prev, action) => {
    switch (action.type) {
      case 'upsert':
        return setInMap(prev, action.item.id, optimisticPending(action.item));
      case 'delete': {
        return removeFromMap(prev, action.id);
      }
    }
  });

  const [updateState, setUpdateState] =
    useState<UpdateRecurringPaymentActionState>({});
  const [updateIsPending, setUpdateIsPending] = useState<boolean>(false);

  return (
    <CollectionField<WithOptimistic<WithID<RecurringPayment>>>
      itemName="Recurring Payment"
      items={mapToArray(optimisticRecurringPayments).map((r) =>
        updateState.meta?.id != null &&
        updateState.errors != null &&
        r.id === updateState.meta.id.toString()
          ? {...r, hasError: true}
          : r,
      )}
      initializeDraftItem={() => ({
        id: createUniqueID(),
        startingMonth: defaultMonth,
        amount: 100,
      })}
      sortItems={(a, b) => a.startingMonth - b.startingMonth}
      onAdd={(draftItem) => {
        startTransition(() => {
          dispatchOptimistic({
            type: 'upsert',
            item: draftItem,
          });
          insertRecurringPayment({
            mortgage_id: parseInt(loanID, 10),
            starting_month: draftItem.startingMonth,
            amount: draftItem.amount,
          });
        });
      }}
      renderEditForm={({draftItem, setDraftItem, close}) => (
        <form
          id="update-recurring-payment-form"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
              dispatchOptimistic({type: 'upsert', item: draftItem});

              setUpdateIsPending(true);
              setUpdateState({});
              const state = await updateRecurringPayment(
                {
                  starting_month: draftItem.startingMonth,
                  amount: draftItem.amount,
                },
                {
                  id: parseInt(draftItem.id, 10),
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
              isRequired
              minValue={startingMonthAndYear}
              value={addMonths(startingMonthAndYear, draftItem.startingMonth)}
              onChange={(monthAndYear) => {
                setDraftItem({
                  ...draftItem,
                  startingMonth: monthDifference(
                    startingMonthAndYear,
                    monthAndYear,
                  ),
                });
              }}
            />
            <CurrencyInput
              htmlName="amount"
              label="Amount per month"
              isRequired
              value={draftItem.amount}
              onChange={(value) =>
                setDraftItem({...draftItem, amount: value})
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
      renderItem={(item, {edit}) => {
        const monthAndYear = addMonths(
          startingMonthAndYear,
          item.startingMonth,
        );
        return (
          <EditableCard
            isPending={item.isPending}
            onEdit={edit}
            onRemove={() => {
              startTransition(() => {
                dispatchOptimistic({
                  type: 'delete',
                  id: item.id,
                });
                deleteRecurringPayment({id: parseInt(item.id, 10)});
              });
            }}
          >
            <MetadataList>
              <MetadataListItem label="Starting date">
                {`${monthAndYear.month} ${monthAndYear.year}`}
              </MetadataListItem>
              <MetadataListItem label="Amount">
                {formatUSD(item.amount)}
              </MetadataListItem>
            </MetadataList>
          </EditableCard>
        );
      }}
    />
  );
}
