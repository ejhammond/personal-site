'use client';

import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Selector } from '@astryxdesign/core/Selector';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import {
  MONTHS,
  Month,
  MonthAndYear,
  monthDifference,
  monthToNumber,
} from '@/utils/date';

/**
 * Month + year picker, mirroring the old ds MonthAndYearField: a month
 * selector beside a 4-digit year input, with an optional minimum value that
 * disables earlier months and rejects earlier selections.
 */
export function MonthAndYearInput({
  label,
  description,
  value,
  onChange,
  minValue,
  isRequired,
  monthInputName = 'month',
  yearInputName = 'year',
}: {
  label: string;
  description?: string;
  value: MonthAndYear;
  onChange: (monthAndYear: MonthAndYear) => void;
  minValue?: MonthAndYear;
  isRequired?: boolean;
  monthInputName?: string;
  yearInputName?: string;
}) {
  return (
    <VStack gap={1}>
      <HStack gap={2} vAlign="end">
        <Selector
          label={label}
          htmlName={monthInputName}
          isRequired={isRequired}
          value={value.month}
          onChange={(month) => {
            const next = { month: month as Month, year: value.year };
            if (minValue != null && monthDifference(minValue, next) < 0) {
              // value is less than minValue
              return;
            }

            onChange(next);
          }}
          options={MONTHS.map((m) => ({
            value: m,
            label: m,
            disabled:
              minValue != null &&
              value.year === minValue.year &&
              monthToNumber(m) < monthToNumber(minValue.month),
          }))}
        />
        <NumberInput
          label={`${label} year`}
          isLabelHidden
          htmlName={yearInputName}
          isRequired={isRequired}
          isIntegerOnly
          min={0}
          formatValue={(year) => String(year)}
          value={value.year}
          onChange={(year) => {
            const next = { month: value.month, year };
            if (minValue != null && monthDifference(minValue, next) < 0) {
              // value is less than minValue
              return;
            }

            onChange(next);
          }}
        />
      </HStack>
      {description != null && <Text type="supporting">{description}</Text>}
    </VStack>
  );
}
