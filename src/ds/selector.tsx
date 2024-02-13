import { css } from '@/panda/css';
import {
  ListBoxItem,
  Label,
  ListBox,
  Select,
  SelectValue,
} from 'react-aria-components';
import { Button } from './button';
import { Popover } from './popover';

export type TSelectorItem<TValue extends string> = Readonly<{
  value: TValue;
  label: string;
}>;

type Props<TValue extends string> = Readonly<{
  label: string;
  isLabelHidden?: boolean;
  button?: React.ReactNode;
  value: TValue;
  onChange: (value: TValue) => void;
  items: ReadonlyArray<TSelectorItem<TValue>>;
  className?: string;
}>;

export function Selector<TValue extends string>({
  label,
  isLabelHidden,
  button,
  value,
  onChange,
  items,
  className,
}: Props<TValue>) {
  return (
    <Select<TSelectorItem<TValue>>
      aria-label={isLabelHidden ? label : undefined}
      selectedKey={value}
      onSelectionChange={(item) => onChange(item as TValue)}
      className={className}
    >
      {!isLabelHidden && (
        <Label className={css({ display: 'block', mb: 'sm' })}>{label}</Label>
      )}
      {button != null ? (
        <>{button}</>
      ) : (
        <Button
          variant="flat"
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: 'sm',
          })}
        >
          <SelectValue />
          <span aria-hidden="true" className={css({ fontSize: '0.25em' })}>
            ▼
          </span>
        </Button>
      )}
      <Popover>
        <ListBox items={items}>
          {(item) => (
            <ListBoxItem
              key={item.value}
              id={item.value}
              textValue={item.label}
              className={css({
                p: 'xs',
                cursor: 'pointer',
                color: 'text-primary',
              })}
            >
              {({ isSelected }) => `${item.label}${isSelected ? ' ✓' : ''}`}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
}
