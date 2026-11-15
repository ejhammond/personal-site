'use client';

import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {createUniqueID, WithID} from '@/utils/id';
import {Refinance} from '@/utils/loan';
import {formatPercent} from '@/utils/number';
import {plural} from '@/utils/string';
import {MonthAndYearInput} from '@/components/month-and-year-input';
import {addMonths, MonthAndYear, monthDifference} from '@/utils/date';
import {CurrencyInput} from '@/components/currency-input';
import {formatUSD} from '@/utils/currency';
import {
  CollectionField,
  EditableCard,
} from '@/components/editable-collection';
import {FormFooter} from '@/components/form-footer';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {VStack} from '@astryxdesign/core/Stack';
import {startTransition, useOptimistic, useState} from 'react';
import {optimisticPending, WithOptimistic} from '@/utils/with-optimistic';
import {mapToArray, removeFromMap, setInMap} from '@/utils/map';
import {
  deleteRefinance,
  insertRefinance,
  updateRefinance,
  UpdateRefinanceActionState,
} from './refinance-actions';

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
    {type: 'upsert'; item: WithID<Refinance>} | {type: 'delete'; id: string}
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
          ? {...r, hasError: true}
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
      renderEditForm={({draftItem, setDraftItem, close}) => (
        <form
          id="update-refinance-form"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
              dispatchOptimistic({type: 'upsert', item: draftItem});

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
            })();
            close();
          }}
        >
          <VStack gap={3}>
            <MonthAndYearInput
              label="Starting date"
              isRequired
              minValue={startingMonthAndYear}
              value={addMonths(startingMonthAndYear, draftItem.month)}
              onChange={(monthAndYear) =>
                setDraftItem({
                  ...draftItem,
                  month: monthDifference(startingMonthAndYear, monthAndYear),
                })
              }
            />
            <NumberInput
              label="Term"
              htmlName="term"
              min={1}
              isRequired
              isIntegerOnly
              value={draftItem.term}
              onChange={(value) => setDraftItem({...draftItem, term: value})}
              formatValue={(term) =>
                `${term} ${plural('year', 'years', term)}`
              }
            />
            <NumberInput
              label="Rate"
              htmlName="rate"
              isRequired
              min={0}
              max={1}
              step={0.001}
              value={draftItem.annualizedInterestRate}
              onChange={(value) =>
                setDraftItem({...draftItem, annualizedInterestRate: value})
              }
              formatValue={(rate) => formatPercent(rate, 3)}
            />
            <CurrencyInput
              label="Pre payment"
              htmlName="prePayment"
              description="Extra payment after down payment and before the first month's payment"
              value={draftItem.prePayment}
              onChange={(value) =>
                setDraftItem({...draftItem, prePayment: value})
              }
            />
            <CheckboxInput
              label="Specify exact amount financed?"
              value={draftItem.principal != null}
              onChange={(isChecked) => {
                if (isChecked) {
                  setDraftItem({...draftItem, principal: NaN});
                } else {
                  setDraftItem({...draftItem, principal: null});
                }
              }}
            />
            {draftItem.principal != null && (
              <CurrencyInput
                label="Amount financed"
                htmlName="principal"
                value={
                  Number.isNaN(draftItem.principal)
                    ? null
                    : draftItem.principal
                }
                onChange={(value) =>
                  setDraftItem({...draftItem, principal: value})
                }
              />
            )}
            <FormFooter
              isPending={updateIsPending}
              errorMessage={updateState.errors?.form}
              onCancel={close}
            />
          </VStack>
        </form>
      )}
      renderItem={(item, {edit}) => {
        const monthAndYear = addMonths(startingMonthAndYear, item.month);
        return (
          <EditableCard
            isPending={item.isPending}
            onEdit={edit}
            onRemove={() => {
              startTransition(() => {
                dispatchOptimistic({
                  type: 'delete',
                  id: item.id,
                });
                deleteRefinance({id: parseInt(item.id, 10)});
              });
            }}
          >
            <MetadataList>
              <MetadataListItem label="Date">
                {`${monthAndYear.month} ${monthAndYear.year}`}
              </MetadataListItem>
              {item.principal != null && (
                <MetadataListItem label="Principal">
                  {formatUSD(item.principal)}
                </MetadataListItem>
              )}
              <MetadataListItem label="Term">
                {`${item.term} ${plural('year', 'years', item.term)}`}
              </MetadataListItem>
              <MetadataListItem label="Rate">
                {formatPercent(item.annualizedInterestRate, 3)}
              </MetadataListItem>
              {item.prePayment !== 0 && (
                <MetadataListItem label="Down">
                  {formatUSD(item.prePayment)}
                </MetadataListItem>
              )}
            </MetadataList>
          </EditableCard>
        );
      }}
    />
  );
}
