import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  Text,
} from 'react-aria-components';

import './index.css';
import { forwardRef } from 'react';
import { VStack } from '../v-stack';

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  hasButtons?: boolean;
  hasSelectOnFocus?: boolean;
}

export const NumberField = forwardRef(
  (
    {
      label,
      description,
      hasButtons = false,
      hasSelectOnFocus = false,
      onFocus,
      ...props
    }: NumberFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <AriaNumberField {...props}>
        <Label>{label}</Label>
        <Group>
          {hasButtons && <Button slot="decrement">-</Button>}
          <Input
            ref={ref}
            onContextMenu={(event) => {
              console.log(event);
              if (hasSelectOnFocus) {
                event.preventDefault();
              }
            }}
            onFocus={(event) => {
              if (hasSelectOnFocus) {
                event.currentTarget.select();
              }
              onFocus?.(event);
            }}
          />
          {hasButtons && <Button slot="increment">+</Button>}
        </Group>
        <VStack>
          {description && <Text slot="description">{description}</Text>}
          <FieldError />
        </VStack>
      </AriaNumberField>
    );
  },
);

NumberField.displayName = 'NumberField';
