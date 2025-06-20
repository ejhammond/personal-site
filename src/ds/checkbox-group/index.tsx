import {
  CheckboxGroup as AriaCheckboxGroup,
  CheckboxGroupProps as AriaCheckboxGroupProps,
  FieldError,
  Label,
  Text,
} from 'react-aria-components';

import './index.css';

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, 'children'> {
  children?: React.ReactNode;
  label?: string;
  description?: string;
}

export function CheckboxGroup({
  label,
  description,
  children,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup {...props}>
      {label && <Label>{label}</Label>}
      {children}
      {description && <Text slot="description">{description}</Text>}
      <FieldError />
    </AriaCheckboxGroup>
  );
}
