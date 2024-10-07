import Collection from '@/ds/collection';
import { NumberField } from '@/ds/number-field';
import { formatUSD } from '@/utils/currency';
import { createUniqueID, WithID } from '@/utils/id';
import { OneOffExtraPayment } from '@/utils/loan';
import MonthAndYearField from './month-and-year-field';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';

export default function OneOffExtraPaymentsField({
  startingMonthAndYear,
  items,
  add,
  remove,
}: {
  startingMonthAndYear: MonthAndYear;
  items: WithID<OneOffExtraPayment>[];
  add: (item: WithID<OneOffExtraPayment>) => void;
  remove: (id: string) => void;
}) {
  return (
    <Collection<WithID<OneOffExtraPayment>>
      itemName="One-off extra payment"
      items={items}
      initializeDraftItem={() => ({
        id: createUniqueID(),
        amount: 100,
        month: 1,
      })}
      sortItems={(a, b) => a.month - b.month}
      onAdd={add}
      onRemove={remove}
      renderEditFormFields={({ month, id, amount }, setDraftItem) => (
        <>
          <MonthAndYearField
            label="Month"
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
          <NumberField
            label="Amount"
            isRequired
            hasSelectOnFocus
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
