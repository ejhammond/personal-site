import Collection from '@/ds/collection';
import { formatUSD } from '@/utils/currency';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';
import { createUniqueID, WithID } from '@/utils/id';
import { RecurringExtraPayment } from '@/utils/loan';
import MonthAndYearField from '../../../../ds/month-and-year-field';
import { CurrencyField } from '@/ds/currency-field';

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
            label="Starting date"
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
          <CurrencyField
            label="Amount per month"
            isRequired
            hasSelectOnFocus
            value={amount}
            onChange={(value) =>
              setDraftItem({ id, amount: value, startingMonth })
            }
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
