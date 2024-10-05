import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  Text,
  ValidationResult,
} from 'react-aria-components';

import './index.css';
import { forwardRef } from 'react';

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  hasButtons?: boolean;
}

export const NumberField = forwardRef(
  (
    {
      label,
      description,
      errorMessage,
      hasButtons = false,
      ...props
    }: NumberFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <AriaNumberField {...props}>
        <Label>{label}</Label>
        <Group>
          {hasButtons && <Button slot="decrement">-</Button>}
          <Input ref={ref} />
          {hasButtons && <Button slot="increment">+</Button>}
        </Group>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaNumberField>
    );
  },
);

NumberField.displayName = 'NumberField';
