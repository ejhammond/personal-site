import { Label } from '@/ds/label';
import { NumberField } from '@/ds/number-field';
import { Select, SelectItem } from '@/ds/select';
import {
  Month,
  MonthAndYear,
  monthDifference,
  MONTHS,
  monthToNumber,
} from '@/utils/date';
import { Group, Text } from 'react-aria-components';

import './month-and-year-field.css';

export default function MonthAndYearField({
  label,
  value,
  onChange,
  minValue,
  isRequired,
  autoFocus,
  description,
  hasSelectOnFocus = false,
}: {
  label: string;
  description?: string;
  value: MonthAndYear;
  onChange: (monthAndYear: MonthAndYear) => void;
  minValue?: MonthAndYear;
  isRequired?: boolean;
  autoFocus?: boolean;
  hasSelectOnFocus?: boolean;
}) {
  return (
    <div className="month-and-year-field">
      <Label>{label}</Label>
      <Group>
        <Select
          autoFocus={autoFocus}
          isRequired={isRequired}
          aria-label={`${label} month`}
          selectedKey={value.month}
          // @ts-expect-error - I promise that each key is a Month
          onSelectionChange={(month: Month) => {
            if (
              minValue != null &&
              monthDifference(minValue, { month, year: value.year }) < 0
            ) {
              // value is less than minValue
              return;
            }

            onChange({ ...value, month });
          }}
          items={MONTHS.map((m) => ({ value: m }))}
        >
          {(item) => (
            <SelectItem
              id={item.value}
              isDisabled={
                minValue != null &&
                value.year === minValue.year &&
                monthToNumber(item.value) < monthToNumber(minValue.month)
              }
            >
              {item.value}
            </SelectItem>
          )}
        </Select>
        <NumberField
          aria-label={`${label} month`}
          isRequired={isRequired}
          hasSelectOnFocus={hasSelectOnFocus}
          value={value.year}
          onChange={(year) => {
            if (
              minValue != null &&
              monthDifference(minValue, { month: value.month, year }) < 0
            ) {
              // value is less than minValue
              return;
            }

            onChange({ ...value, year });
          }}
          minValue={0}
          formatOptions={{
            style: 'decimal',
            minimumIntegerDigits: 4,
            maximumFractionDigits: 0,
            useGrouping: false, // no comma separator
          }}
        />
      </Group>
      {description && <Text slot="description">{description}</Text>}
    </div>
  );
}
