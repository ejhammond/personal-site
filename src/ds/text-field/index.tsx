'use client';

import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';

import './index.css';
import { forwardRef } from 'react';

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
}

export const TextField = forwardRef(
  (
    { label, description, ...props }: TextFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <AriaTextField {...props}>
        <Label>{label}</Label>
        <Input ref={ref} />
        {description && <Text slot="description">{description}</Text>}
        <FieldError />
      </AriaTextField>
    );
  },
);

TextField.displayName = 'TextField';
