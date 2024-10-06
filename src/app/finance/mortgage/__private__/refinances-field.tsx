import { Checkbox } from '@/ds/checkbox';
import Collection from '@/ds/collection';
import { NumberField } from '@/ds/number-field';
import { createUniqueID, WithID } from '@/utils/id';
import { Refinance } from '@/utils/loan';
import { formatPercent } from '@/utils/number';
import { plural } from '@/utils/string';

export default function RefinancesField({
  items,
  add,
  remove,
}: {
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
        month: 12,
        principal: null,
        annualizedInterestRate: 0.05,
        years: 30,
      })}
      onAdd={add}
      onRemove={remove}
      renderEditFormFields={(
        { month, id, principal, years, annualizedInterestRate },
        setDraftItem,
      ) => (
        <>
          <NumberField
            autoFocus
            label="Month"
            isRequired
            minValue={0}
            value={month}
            onChange={(value) =>
              setDraftItem({
                id,
                principal,
                annualizedInterestRate,
                years,
                month: value,
              })
            }
          />
          <NumberField
            label="Term"
            minValue={1}
            isRequired
            value={years}
            onChange={(value) =>
              setDraftItem({
                id,
                principal,
                annualizedInterestRate,
                years: value,
                month,
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
              })
            }
            formatOptions={{
              style: 'percent',
              minimumFractionDigits: 3,
            }}
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
                });
              } else {
                setDraftItem({
                  id,
                  month,
                  principal: null,
                  annualizedInterestRate,
                  years,
                });
              }
            }}
          >
            Specify exact amount?
          </Checkbox>
          {principal != null && (
            <NumberField
              label="Amount"
              minValue={1}
              value={principal ?? NaN}
              onChange={(value) =>
                setDraftItem({
                  id,
                  principal: value,
                  annualizedInterestRate,
                  years,
                  month,
                })
              }
              formatOptions={{
                style: 'currency',
                currencySign: 'standard',
                currency: 'USD',
                currencyDisplay: 'symbol',
                maximumFractionDigits: 2,
              }}
            />
          )}
        </>
      )}
      renderItem={(item) => (
        <span>
          {formatPercent(item.annualizedInterestRate, 3)} for {item.years}{' '}
          {plural('year', 'years', item.years)} on month {item.month}
        </span>
      )}
    />
  );
}
