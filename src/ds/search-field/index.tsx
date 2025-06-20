import {
  Button,
  FieldError,
  Input,
  Label,
  SearchField as AriaSearchField,
  SearchFieldProps as AriaSearchFieldProps,
  Text,
} from 'react-aria-components';

import './index.css';

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
}

export function SearchField({
  label,
  description,
  ...props
}: SearchFieldProps) {
  return (
    <AriaSearchField {...props}>
      <Label>{label}</Label>
      <Input />
      <Button>✕</Button>
      {description && <Text slot="description">{description}</Text>}
      <FieldError />
    </AriaSearchField>
  );
}
