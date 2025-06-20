import {
  ColorField as AriaColorField,
  ColorFieldProps as AriaColorFieldProps,
  FieldError,
  Input,
  Label,
  Text,
} from 'react-aria-components';

import './index.css';

export interface ColorFieldProps extends AriaColorFieldProps {
  label?: string;
  description?: string;
}

export function ColorField({ label, description, ...props }: ColorFieldProps) {
  return (
    <AriaColorField {...props}>
      {label && <Label>{label}</Label>}
      <Input />
      {description && <Text slot="description">{description}</Text>}
      <FieldError />
    </AriaColorField>
  );
}
