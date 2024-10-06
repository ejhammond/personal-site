import Collection from '@/ds/collection';
import { NumberField } from '@/ds/number-field';
import useAutoFocusRef from '@/ds/use-auto-focus';
import { formatUSD } from '@/utils/currency';
import { createUniqueID, WithID } from '@/utils/id';
import { OneOffExtraPayment } from '@/utils/loan';

export default function OneOffExtraPaymentsField({
  items,
  add,
  remove,
}: {
  items: WithID<OneOffExtraPayment>[];
  add: (item: WithID<OneOffExtraPayment>) => void;
  remove: (id: string) => void;
}) {
  const autoFocusRef = useAutoFocusRef();

  return (
    <Collection<WithID<OneOffExtraPayment>>
      itemName="One-off extra payment"
      items={items}
      initializeDraftItem={() => ({
        id: createUniqueID(),
        amount: 100,
        month: 1,
      })}
      onAdd={add}
      onRemove={remove}
      renderEditFormFields={({ month, id, amount }, setDraftItem) => (
        <>
          <NumberField
            ref={autoFocusRef}
            label="Month"
            isRequired
            minValue={0}
            value={month}
            onChange={(value) => setDraftItem({ id, amount, month: value })}
          />
          <NumberField
            label="Amount"
            isRequired
            minValue={0}
            value={amount}
            onChange={(value) => setDraftItem({ id, amount: value, month })}
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
          {formatUSD(item.amount)} on month {item.month}
        </span>
      )}
    />
  );
}
