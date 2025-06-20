import React from 'react';
import { Button } from './button';
import { VStack } from './v-stack';
import { Label } from './label';
import EditableItem from './editable-item';
import { WithID } from '@/utils/id';
import { WithOptimistic } from '@/utils/with-optimistic';

export default function CollectionField<
  TItem extends WithOptimistic<WithID<unknown>>,
>({
  itemName,
  itemNamePlural,
  items,
  onAdd,
  onRemove,
  renderEditForm,
  renderItem,
  initializeDraftItem,
  sortItems,
}: {
  itemNamePlural?: string;
  items: TItem[];
  onAdd: (item: TItem) => void;
  onRemove: (id: string) => void;
  initializeDraftItem: () => TItem;
  sortItems?: (a: TItem, b: TItem) => number;
} & Omit<
  React.ComponentProps<typeof EditableItem<TItem>>,
  'onRemove' | 'item'
>) {
  return (
    <VStack hAlign="start">
      <Label>{itemNamePlural ?? `${itemName}s`}</Label>
      <div style={{ paddingInlineStart: '16px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.toSorted(sortItems).map((item) => (
            <li key={item.id}>
              <EditableItem
                itemName={itemName}
                item={item}
                isPending={item.isPending}
                hasError={item.hasError}
                renderEditForm={renderEditForm}
                renderItem={renderItem}
                onRemove={() => onRemove(item.id)}
              />
            </li>
          ))}
        </ul>
        <Button
          type="button"
          onPress={() => onAdd(initializeDraftItem())}
          style={{ marginTop: items.length === 0 ? 8 : 0 }}
        >
          Add {itemName.toLowerCase()}
        </Button>
      </div>
    </VStack>
  );
}
