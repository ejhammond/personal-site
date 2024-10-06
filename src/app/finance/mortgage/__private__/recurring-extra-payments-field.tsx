import Collection from '@/ds/collection';
import { NumberField } from '@/ds/number-field';
import { formatUSD } from '@/utils/currency';
import { createUniqueID, WithID } from '@/utils/id';
import { RecurringExtraPayment } from '@/utils/loan';

export default function RecurringExtraPaymentsField({
  items,
  add,
  remove,
}: {
  items: WithID<RecurringExtraPayment>[];
  add: (item: WithID<RecurringExtraPayment>) => void;
  remove: (id: string) => void;
}) {
  return (
    <Collection<WithID<RecurringExtraPayment>>
      itemName="Recurring extra payment"
      items={items}
      initializeDraftItem={() => ({
        id: createUniqueID(),
        amount: 100,
        startingMonth: 1,
      })}
      onAdd={add}
      onRemove={remove}
      renderEditFormFields={({ startingMonth, id, amount }, setDraftItem) => (
        <>
          <NumberField
            autoFocus
            label="Starting month"
            isRequired
            minValue={1}
            value={startingMonth}
            onChange={(value) =>
              setDraftItem({ id, amount, startingMonth: value })
            }
          />
          <NumberField
            label="Amount"
            isRequired
            minValue={0}
            value={amount}
            onChange={(value) =>
              setDraftItem({ id, amount: value, startingMonth })
            }
            formatOptions={{
              style: 'currency',
              currencySign: 'standard',
              currency: 'USD',
              currencyDisplay: 'symbol',
              maximumFractionDigits: 2,
            }}
          />
        </>
      )}
      renderItem={(item) => (
        <span>
          {formatUSD(item.amount)}/month starting on month {item.startingMonth}
        </span>
      )}
    />
  );
}
