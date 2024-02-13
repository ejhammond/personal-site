import React from 'react';
import { VStack } from '@/ds/v-stack';
import { Text } from '@/ds/text';
import { hStack } from '@/ds/styles/h-stack-style';

type HTMLInputProps = React.ComponentProps<'input'>;

type Props = Omit<HTMLInputProps, 'onChange' | 'type'> &
  Readonly<{
    label: string;
    subLabel?: string;
    onChange: (value: boolean) => void;
  }>;

export function Checkbox({
  children,
  onChange,
  label,
  subLabel,
  ...htmlInputProps
}: Props) {
  return (
    <label className={hStack({ vAlign: 'center', gap: 'sm' })}>
      <input
        {...htmlInputProps}
        type="checkbox"
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <VStack>
        <Text>{label}</Text>
        {subLabel != null && <Text variant="supporting">{subLabel}</Text>}
      </VStack>
    </label>
  );
}
