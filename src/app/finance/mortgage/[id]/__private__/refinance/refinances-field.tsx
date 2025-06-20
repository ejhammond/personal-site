import { Checkbox } from '@/ds/checkbox';
import { NumberField } from '@/ds/number-field';
import { createUniqueID, WithID } from '@/utils/id';
import { Refinance } from '@/utils/loan';
import { formatPercent } from '@/utils/number';
import { plural } from '@/utils/string';
import MonthAndYearField from '@/ds/month-and-year-field';
import { addMonths, MonthAndYear, monthDifference } from '@/utils/date';
import { CurrencyField } from '@/ds/currency-field';
import { formatUSD } from '@/utils/currency';
import CollectionField from '@/ds/collection-field';
import { startTransition, useOptimistic, useState } from 'react';
import { optimisticPending, WithOptimistic } from '@/utils/with-optimistic';
import { mapToArray, removeFromMap, setInMap } from '@/utils/map';
import {
  deleteRefinance,
  insertRefinance,
  updateRefinance,
  UpdateRefinanceActionState,
} from './refinance-actions';
import { Form } from '@/ds/form';
import FormFooter from '@/ds/form/footer';

export default function RefinancesField({
  defaultMonth = 1,
  startingMonthAndYear,
  items,
  loanID,
}: {
  loanID: string;
  defaultMonth?: number;
  startingMonthAndYear: MonthAndYear;
  items: ReadonlyMap<string, WithID<Refinance>>;
}) {
  const [optimisticRefinances, dispatchOptimistic] = useOptimistic<
    ReadonlyMap<string, WithOptimistic<WithID<Refinance>>>,
    { type: 'upsert'; item: WithID<Refinance> } | { type: 'delete'; id: string }
  >(items, (prev, action) => {
    switch (action.type) {
      case 'upsert':
        return setInMap(prev, action.item.id, optimisticPending(action.item));
      case 'delete': {
        return removeFromMap(prev, action.id);
      }
    }
  });

  const [updateState, setUpdateState] = useState<UpdateRefinanceActionState>(
    {},
  );
  const [updateIsPending, setUpdateIsPending] = useState<boolean>(false);

  return (
    <CollectionField<WithOptimistic<WithID<Refinance>>>
      itemName="Refinance"
      items={mapToArray(optimisticRefinances).map((r) =>
        updateState.meta?.id != null &&
        updateState.errors != null &&
        r.id === updateState.meta.id.toString()
          ? { ...r, hasError: true }
          : r,
      )}
      initializeDraftItem={() => ({
        id: createUniqueID(),
        month: defaultMonth,
        principal: null,
        annualizedInterestRate: 0.05,
        term: 30,
        prePayment: 0,
      })}
      sortItems={(a, b) => a.month - b.month}
      onAdd={(draftItem) => {
        startTransition(() => {
          dispatchOptimistic({
            type: 'upsert',
            item: draftItem,
          });
          insertRefinance({
            mortgage_id: parseInt(loanID, 10),
            month: draftItem.month,
            principal: draftItem.principal,
            annualized_interest_rate: draftItem.annualizedInterestRate,
            term: draftItem.term,
            pre_payment: draftItem.prePayment,
          });
        });
      }}
      onRemove={(id) => {
        startTransition(() => {
          dispatchOptimistic({
            type: 'delete',
            id,
          });
          deleteRefinance({ id: parseInt(id, 10) });
        });
      }}
      renderEditForm={({ draftItem, setDraftItem, close }) => (
        <Form
          id="update-refinance-form"
          isPending={updateIsPending}
          action={async () => {
            dispatchOptimistic({ type: 'upsert', item: draftItem });

            setUpdateIsPending(true);
            setUpdateState({});
            const state = await updateRefinance(
              {
                month: draftItem.month,
                principal: draftItem.principal,
                annualized_interest_rate: draftItem.annualizedInterestRate,
                term: draftItem.term,
                pre_payment: draftItem.prePayment,
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
            isRequired
            autoFocus
            hasSelectOnFocus
            minValue={startingMonthAndYear}
            value={addMonths(startingMonthAndYear, draftItem.month)}
            onChange={(monthAndYear) =>
              setDraftItem({
                ...draftItem,
                month: monthDifference(startingMonthAndYear, monthAndYear),
              })
            }
          />
          <NumberField
            label="Term"
            name="term"
            minValue={1}
            isRequired
            hasSelectOnFocus
            value={draftItem.term}
            onChange={(value) => setDraftItem({ ...draftItem, term: value })}
            formatOptions={{
              style: 'unit',
              unit: 'year',
              unitDisplay: 'long',
            }}
          />
          <NumberField
            label="Rate"
            name="rate"
            isRequired
            hasSelectOnFocus
            minValue={0}
            maxValue={1}
            value={draftItem.annualizedInterestRate}
            onChange={(value) =>
              setDraftItem({ ...draftItem, annualizedInterestRate: value })
            }
            formatOptions={{
              style: 'percent',
              minimumFractionDigits: 3,
            }}
          />
          <CurrencyField
            label="Pre payment"
            name="prePayment"
            description="Extra payment after down payment and before the first month's payment"
            hasSelectOnFocus
            value={draftItem.prePayment}
            onChange={(value) =>
              setDraftItem({ ...draftItem, prePayment: value })
            }
          />
          <Checkbox
            isSelected={draftItem.principal != null}
            onChange={(isChecked) => {
              if (isChecked) {
                setDraftItem({ ...draftItem, principal: NaN });
              } else {
                setDraftItem({ ...draftItem, principal: null });
              }
            }}
          >
            Specify exact amount financed?
          </Checkbox>
          {draftItem.principal != null && (
            <CurrencyField
              label="Amount financed"
              name="principal"
              hasSelectOnFocus
              value={draftItem.principal ?? NaN}
              onChange={(value) =>
                setDraftItem({ ...draftItem, principal: value })
              }
            />
          )}
        </Form>
      )}
      renderItem={(item, { isPending }) => {
        const monthAndYear = addMonths(startingMonthAndYear, item.month);
        return (
          <span
            style={{
              color: isPending ? 'var(--text-color-disabled)' : 'inherit',
            }}
          >
            {monthAndYear.month} {monthAndYear.year} -{' '}
            {item.principal != null ? `${formatUSD(item.principal)} @ ` : ''}
            {formatPercent(item.annualizedInterestRate, 3)} for {item.term}{' '}
            {plural('year', 'years', item.term)}
            {item.prePayment != null && item.prePayment !== 0
              ? ` with ${formatUSD(item.prePayment)} down`
              : ''}
          </span>
        );
      }}
    />
  );
}
