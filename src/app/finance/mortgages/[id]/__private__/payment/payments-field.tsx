'use client';

import { createUniqueID, parseDBID, WithID } from '@/utils/id';
import { Payment } from '@/utils/loan';
import { MonthAndYearInput } from '@/components/month-and-year-input';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';
import { CurrencyInput } from '@/components/currency-input';
import { formatUSD } from '@/utils/currency';
import {
  CollectionField,
  EditableCard,
} from '@/components/editable-collection';
import { FormFooter } from '@/components/form-footer';
import {
  MetadataList,
  MetadataListItem,
} from '@astryxdesign/core/MetadataList';
import { VStack } from '@astryxdesign/core/Stack';
import { startTransition, useOptimistic, useState } from 'react';
import { useRouter } from 'next/navigation';
import { optimisticPending, WithOptimistic } from '@/utils/with-optimistic';
import { mapToArray, removeFromMap, setInMap } from '@/utils/map';
import {
  deletePayment,
  insertPayment,
  updatePayment,
  UpdatePaymentActionState,
} from './payment-actions';

export default function PaymentsField({
  defaultMonth = 1,
  startingMonthAndYear,
  items,
  loanID,
}: {
  loanID: string;
  defaultMonth?: number;
  startingMonthAndYear: MonthAndYear;
  items: ReadonlyMap<string, WithID<Payment>>;
}) {
  const [optimisticPayments, dispatchOptimistic] = useOptimistic<
    ReadonlyMap<string, WithOptimistic<WithID<Payment>>>,
    { type: 'upsert'; item: WithID<Payment> } | { type: 'delete'; id: string }
  >(items, (prev, action) => {
    switch (action.type) {
      case 'upsert':
        return setInMap(prev, action.item.id, optimisticPending(action.item));
      case 'delete': {
        return removeFromMap(prev, action.id);
      }
    }
  });

  const [updateState, setUpdateState] = useState<UpdatePaymentActionState>({});
  const [updateIsPending, setUpdateIsPending] = useState<boolean>(false);
  const router = useRouter();

  return (
    <CollectionField<WithOptimistic<WithID<Payment>>>
      itemName="Payment"
      items={mapToArray(optimisticPayments).map((p) =>
        updateState.meta?.id != null &&
        updateState.errors != null &&
        p.id === updateState.meta.id.toString()
          ? { ...p, hasError: true }
          : p,
      )}
      initializeDraftItem={() => ({
        id: createUniqueID(),
        month: defaultMonth,
        amount: 100,
      })}
      sortItems={(a, b) => a.month - b.month}
      onAdd={(draftItem) => {
        startTransition(() => {
          dispatchOptimistic({
            type: 'upsert',
            item: draftItem,
          });
        });
        void (async () => {
          const state = await insertPayment({
            mortgage_id: parseInt(loanID, 10),
            month: draftItem.month,
            amount: draftItem.amount,
          });
          // A failed insert must not leave a phantom item on screen.
          if (state.errors != null) {
            router.refresh();
          }
        })();
      }}
      renderEditForm={({ draftItem, setDraftItem, close }) => (
        <form
          id="update-payment-form"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
              const id = parseDBID(draftItem.id);
              if (id == null) {
                // A placeholder id means the item hasn't been saved yet;
                // there is no row to update. Keep the dialog open and let
                // the user retry once the insert has landed.
                setUpdateState({
                  errors: {
                    form: 'This item is still saving — close and try again in a moment.',
                  },
                });
                return;
              }

              dispatchOptimistic({ type: 'upsert', item: draftItem });

              setUpdateIsPending(true);
              setUpdateState({});
              const state = await updatePayment(
                {
                  month: draftItem.month,
                  amount: draftItem.amount,
                },
                { id },
              );
              setUpdateState(state);
              setUpdateIsPending(false);
              // Only close on success: on failure the dialog stays open
              // with the error in the footer, and the optimistic value is
              // rolled back to server truth.
              if (state.errors == null) {
                close();
              } else {
                router.refresh();
              }
            })();
          }}
        >
          <VStack gap={3}>
            <MonthAndYearInput
              label="Date"
              isRequired
              minValue={startingMonthAndYear}
              value={addMonths(startingMonthAndYear, draftItem.month)}
              onChange={(monthAndYear) => {
                setDraftItem({
                  ...draftItem,
                  month: monthDifference(startingMonthAndYear, monthAndYear),
                });
              }}
            />
            <CurrencyInput
              htmlName="amount"
              label="Amount"
              isRequired
              value={draftItem.amount}
              onChange={(value) =>
                setDraftItem({ ...draftItem, amount: value })
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
      renderItem={(item, { edit }) => {
        const monthAndYear = addMonths(startingMonthAndYear, item.month);
        return (
          <EditableCard
            isPending={item.isPending}
            onEdit={edit}
            onRemove={() => {
              const id = parseDBID(item.id);
              startTransition(() => {
                dispatchOptimistic({
                  type: 'delete',
                  id: item.id,
                });
              });
              if (id == null) {
                // Never saved server-side; nothing to delete.
                return;
              }
              void (async () => {
                const state = await deletePayment({ id });
                // A failed delete must not leave the item missing.
                if (state.errors != null) {
                  router.refresh();
                }
              })();
            }}
          >
            <MetadataList>
              <MetadataListItem label="Date">
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
