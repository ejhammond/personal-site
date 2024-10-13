import { Checkbox } from '@/ds/checkbox';
import Collection from '@/ds/collection';
import { NumberField } from '@/ds/number-field';
import { createUniqueID, WithID } from '@/utils/id';
import { Refinance } from '@/utils/loan';
import { formatPercent } from '@/utils/number';
import { plural } from '@/utils/string';
import MonthAndYearField from '../../../../ds/month-and-year-field';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';
import { CurrencyField } from '@/ds/currency-field';
import { formatUSD } from '@/utils/currency';

export default function RefinancesField({
  defaultMonth = 1,
  startingMonthAndYear,
  items,
  add,
  remove,
}: {
  defaultMonth?: number;
  startingMonthAndYear: MonthAndYear;
  items: WithID<Refinance>[];
  add: (item: WithID<Refinance>) => void;
  remove: (id: string) => void;
}) {
  return (
    <Collection<WithID<Refinance>>
      itemName="Refinance"
      items={items}
      initializeDraftItem={() => ({
        id: createUniqueID(),
        month: defaultMonth,
        principal: null,
        annualizedInterestRate: 0.05,
        years: 30,
        prePayment: 0,
      })}
      sortItems={(a, b) => a.month - b.month}
      onAdd={add}
      onRemove={remove}
      renderEditFormFields={(
        { month, id, principal, years, annualizedInterestRate, prePayment },
        setDraftItem,
      ) => (
        <>
          <MonthAndYearField
            label="Starting date"
            isRequired
            autoFocus
            hasSelectOnFocus
            minValue={startingMonthAndYear}
            value={addMonths(startingMonthAndYear, month)}
            onChange={(monthAndYear) =>
              setDraftItem({
                id,
                principal,
                years,
                annualizedInterestRate,
                prePayment,
                month: monthDifference(startingMonthAndYear, monthAndYear),
              })
            }
          />
          <NumberField
            label="Term"
            minValue={1}
            isRequired
            hasSelectOnFocus
            value={years}
            onChange={(value) =>
              setDraftItem({
                id,
                principal,
                annualizedInterestRate,
                years: value,
                month,
                prePayment,
              })
            }
            formatOptions={{
              style: 'unit',
              unit: 'year',
              unitDisplay: 'long',
            }}
          />
          <NumberField
            label="Rate"
            isRequired
            hasSelectOnFocus
            minValue={0}
            maxValue={1}
            value={annualizedInterestRate}
            onChange={(value) =>
              setDraftItem({
                id,
                principal,
                annualizedInterestRate: value,
                years,
                month,
                prePayment,
              })
            }
            formatOptions={{
              style: 'percent',
              minimumFractionDigits: 3,
            }}
          />
          <CurrencyField
            label="Pre payment"
            description="Extra payment after down payment and before the first month's payment"
            hasSelectOnFocus
            value={prePayment}
            onChange={(value) =>
              setDraftItem({
                id,
                principal,
                annualizedInterestRate,
                years,
                month,
                prePayment: value,
              })
            }
          />
          <Checkbox
            isSelected={principal != null}
            onChange={(isChecked) => {
              if (isChecked) {
                setDraftItem({
                  id,
                  month,
                  principal: NaN,
                  annualizedInterestRate,
                  years,
                  prePayment,
                });
              } else {
                setDraftItem({
                  id,
                  month,
                  principal: null,
                  annualizedInterestRate,
                  years,
                  prePayment,
                });
              }
            }}
          >
            Specify exact amount financed?
          </Checkbox>
          {principal != null && (
            <CurrencyField
              label="Amount financed"
              hasSelectOnFocus
              value={principal ?? NaN}
              onChange={(value) =>
                setDraftItem({
                  id,
                  principal: value,
                  annualizedInterestRate,
                  years,
                  month,
                  prePayment,
                })
              }
            />
          )}
        </>
      )}
      renderItem={(item) => {
        const monthAndYear = addMonths(startingMonthAndYear, item.month);
        return (
          <span>
            {monthAndYear.month} {monthAndYear.year} -{' '}
            {item.principal != null ? `${formatUSD(item.principal)} @ ` : ''}
            {formatPercent(item.annualizedInterestRate, 3)} for {item.years}{' '}
            {plural('year', 'years', item.years)}
          </span>
        );
      }}
    />
  );
}
