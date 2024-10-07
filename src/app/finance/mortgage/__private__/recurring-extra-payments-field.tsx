import Collection from '@/ds/collection';
import { NumberField } from '@/ds/number-field';
import { formatUSD } from '@/utils/currency';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';
import { createUniqueID, WithID } from '@/utils/id';
import { RecurringExtraPayment } from '@/utils/loan';
import MonthAndYearField from './month-and-year-field';

export default function RecurringExtraPaymentsField({
  startingMonthAndYear,
  items,
  add,
  remove,
}: {
  startingMonthAndYear: MonthAndYear;
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
      sortItems={(a, b) => a.startingMonth - b.startingMonth}
      onAdd={add}
      onRemove={remove}
      renderEditFormFields={({ startingMonth, id, amount }, setDraftItem) => (
        <>
          <MonthAndYearField
            label="Starting month"
            isRequired
            autoFocus
            hasSelectOnFocus
            minValue={startingMonthAndYear}
            value={addMonths(startingMonthAndYear, startingMonth)}
            onChange={(monthAndYear) =>
              setDraftItem({
                id,
                amount,
                startingMonth: monthDifference(
                  startingMonthAndYear,
                  monthAndYear,
                ),
              })
            }
          />
          <NumberField
            label="Amount"
            isRequired
            hasSelectOnFocus
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
      renderItem={(item) => {
        const monthAndYear = addMonths(
          startingMonthAndYear,
          item.startingMonth,
        );
        return (
          <span>
            {formatUSD(item.amount)}/month starting in {monthAndYear.month}{' '}
            {monthAndYear.year}
          </span>
        );
      }}
    />
  );
}
