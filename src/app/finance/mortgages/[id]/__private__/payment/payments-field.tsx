import { createUniqueID, WithID } from '@/utils/id';
import { Payment } from '@/utils/loan';
import MonthAndYearField from '@/ds/month-and-year-field';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';
import { CurrencyField } from '@/ds/currency-field';
import { formatUSD } from '@/utils/currency';
import CollectionField from '@/ds/collection-field';
import { startTransition, useOptimistic, useState } from 'react';
import { optimisticPending, WithOptimistic } from '@/utils/with-optimistic';
import { mapToArray, removeFromMap, setInMap } from '@/utils/map';
import {
  deletePayment,
  insertPayment,
  updatePayment,
  UpdatePaymentActionState,
} from './payment-actions';
import { Form } from '@/ds/form';
import FormFooter from '@/ds/form/footer';
import { EditableCard } from '@/ds/editable-card';
import { DescriptionList, DescriptionListItem } from '@/ds/description-list';

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
          insertPayment({
            mortgage_id: parseInt(loanID, 10),
            month: draftItem.month,
            amount: draftItem.amount,
          });
        });
      }}
      renderEditForm={({ draftItem, setDraftItem, close }) => (
        <Form
          id="update-payment-form"
          isPending={updateIsPending}
          action={async () => {
            dispatchOptimistic({ type: 'upsert', item: draftItem });

            setUpdateIsPending(true);
            setUpdateState({});
            const state = await updatePayment(
              {
                month: draftItem.month,
                amount: draftItem.amount,
              },
              {
                id: parseInt(draftItem.id, 10),
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
            label="Date"
            autoFocus
            isRequired
            hasSelectOnFocus
            minValue={startingMonthAndYear}
            value={addMonths(startingMonthAndYear, draftItem.month)}
            onChange={(monthAndYear) => {
              setDraftItem({
                ...draftItem,
                month: monthDifference(startingMonthAndYear, monthAndYear),
              });
            }}
          />
          <CurrencyField
            name="amount"
            label="Amount"
            isRequired
            hasSelectOnFocus
            value={draftItem.amount}
            onChange={(value) => setDraftItem({ ...draftItem, amount: value })}
          />
        </Form>
      )}
      renderItem={(item, { edit }) => {
        const monthAndYear = addMonths(startingMonthAndYear, item.month);
        return (
          <EditableCard
            style={{
              color: item.isPending ? 'var(--text-color-disabled)' : 'inherit',
            }}
            onEdit={edit}
            onRemove={() => {
              startTransition(() => {
                dispatchOptimistic({
                  type: 'delete',
                  id: item.id,
                });
                deletePayment({ id: parseInt(item.id, 10) });
              });
            }}
          >
            <DescriptionList>
              <DescriptionListItem
                label="Date"
                value={`${monthAndYear.month} ${monthAndYear.year}`}
              />
              <DescriptionListItem
                label="Amount"
                value={formatUSD(item.amount)}
              />
            </DescriptionList>
          </EditableCard>
        );
      }}
    />
  );
}
