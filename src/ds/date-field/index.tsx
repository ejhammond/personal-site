import {
  DateField as AriaDateField,
  DateFieldProps as AriaDateFieldProps,
  DateInput,
  DateSegment,
  DateValue,
  FieldError,
  Label,
  Text,
} from 'react-aria-components';

import './index.css';

export interface DateFieldProps<T extends DateValue>
  extends Omit<AriaDateFieldProps<T>, 'granularity'> {
  label?: string;
  description?: string;
}

export function DateField<T extends DateValue>({
  label,
  description,
  ...props
}: DateFieldProps<T>) {
  return (
    <AriaDateField {...props}>
      <Label>{label}</Label>
      <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
      {description && <Text slot="description">{description}</Text>}
      <FieldError />
    </AriaDateField>
  );
}
