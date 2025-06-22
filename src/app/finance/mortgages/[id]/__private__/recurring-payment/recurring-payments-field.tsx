import { createUniqueID, WithID } from '@/utils/id';
import { RecurringPayment } from '@/utils/loan';
import MonthAndYearField from '@/ds/month-and-year-field';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';
import { CurrencyField } from '@/ds/currency-field';
import { formatUSD } from '@/utils/currency';
import CollectionField from '@/ds/collection-field';
import { startTransition, useOptimistic, useState } from 'react';
import { optimisticPending, WithOptimistic } from '@/utils/with-optimistic';
import { mapToArray, removeFromMap, setInMap } from '@/utils/map';
import {
  deleteRecurringPayment,
  insertRecurringPayment,
  updateRecurringPayment,
  UpdateRecurringPaymentActionState,
} from './recurring-payment-actions';
import { Form } from '@/ds/form';
import FormFooter from '@/ds/form/footer';

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
    | { type: 'upsert'; item: WithID<RecurringPayment> }
    | { type: 'delete'; id: string }
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
          ? { ...r, hasError: true }
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
      onRemove={(id) => {
        startTransition(() => {
          dispatchOptimistic({
            type: 'delete',
            id,
          });
          deleteRecurringPayment({ id: parseInt(id, 10) });
        });
      }}
      renderEditForm={({ draftItem, setDraftItem, close }) => (
        <Form
          id="update-recurring-payment-form"
          isPending={updateIsPending}
          action={async () => {
            dispatchOptimistic({ type: 'upsert', item: draftItem });

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
          }}
          onSubmit={() => {
            close();
          }}
          footer={<FormFooter errorMessage={updateState.errors?.form} />}
          validationErrors={updateState.errors}
        >
          <MonthAndYearField
            label="Starting date"
            autoFocus
            isRequired
            hasSelectOnFocus
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
          <CurrencyField
            name="amount"
            label="Amount per month"
            isRequired
            hasSelectOnFocus
            value={draftItem.amount}
            onChange={(value) => setDraftItem({ ...draftItem, amount: value })}
          />
        </Form>
      )}
      renderItem={(item, { isPending }) => {
        const monthAndYear = addMonths(
          startingMonthAndYear,
          item.startingMonth,
        );
        return (
          <span
            style={{
              color: isPending ? 'var(--text-color-disabled)' : 'inherit',
            }}
          >
            {monthAndYear.month} {monthAndYear.year} - {formatUSD(item.amount)}
            /month
          </span>
        );
      }}
    />
  );
}
