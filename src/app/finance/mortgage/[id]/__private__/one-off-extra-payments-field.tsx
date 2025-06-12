import { formatUSD } from '@/utils/currency';
import { createUniqueID, WithID } from '@/utils/id';
import { OneOffExtraPayment } from '@/utils/loan';
import MonthAndYearField from '@/ds/month-and-year-field';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';
import { CurrencyField } from '@/ds/currency-field';
import CollectionField from '@/ds/collection-field';

export default function OneOffExtraPaymentsField({
  defaultMonth = 1,
  startingMonthAndYear,
  items,
  add,
  remove,
}: {
  defaultMonth?: number;
  startingMonthAndYear: MonthAndYear;
  items: WithID<OneOffExtraPayment>[];
  add: (item: WithID<OneOffExtraPayment>) => void;
  remove: (id: string) => void;
}) {
  return (
    <CollectionField<WithID<OneOffExtraPayment>>
      itemName="One-off extra payment"
      items={items}
      initializeDraftItem={() => ({
        id: createUniqueID(),
        amount: 100,
        month: defaultMonth,
      })}
      sortItems={(a, b) => a.month - b.month}
      onAdd={add}
      onRemove={remove}
      renderEditFormFields={({ month, id, amount }, setDraftItem) => (
        <>
          <MonthAndYearField
            label="Date"
            autoFocus
            isRequired
            hasSelectOnFocus
            minValue={startingMonthAndYear}
            value={addMonths(startingMonthAndYear, month)}
            onChange={(monthAndYear) => {
              setDraftItem({
                id,
                amount,
                month: monthDifference(startingMonthAndYear, monthAndYear),
              });
            }}
          />
          <CurrencyField
            label="Amount"
            isRequired
            hasSelectOnFocus
            value={amount}
            onChange={(value) => setDraftItem({ id, amount: value, month })}
          />
        </>
      )}
      renderItem={(item) => {
        const monthAndYear = addMonths(startingMonthAndYear, item.month);
        return (
          <span>
            {formatUSD(item.amount)} in {monthAndYear.month} {monthAndYear.year}
          </span>
        );
      }}
    />
  );
}
