import React from 'react';
import { Button } from './button';
import { VStack } from './v-stack';
import { Label } from './label';
import EditableItem from './editable-item';
import { WithID } from '@/utils/id';

export default function CollectionField<TItem extends WithID<unknown>>({
  itemName,
  itemNamePlural,
  items,
  onAdd,
  renderEditForm,
  renderItem,
  initializeDraftItem,
  sortItems,
}: {
  itemNamePlural?: string;
  items: TItem[];
  onAdd: (item: TItem) => void;
  initializeDraftItem: () => TItem;
  sortItems?: (a: TItem, b: TItem) => number;
} & Omit<React.ComponentProps<typeof EditableItem<TItem>>, 'item'>) {
  return (
    <VStack gap="sm">
      <Label>{itemNamePlural ?? `${itemName}s`}</Label>
      <VStack gap="sm" style={{ paddingInlineStart: '16px' }}>
        {items.length > 0 && (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {items.toSorted(sortItems).map((item) => (
              <li key={item.id}>
                <EditableItem
                  itemName={itemName}
                  item={item}
                  renderEditForm={renderEditForm}
                  renderItem={renderItem}
                />
              </li>
            ))}
          </ul>
        )}
        <Button type="button" onPress={() => onAdd(initializeDraftItem())}>
          Add {itemName.toLowerCase()}
        </Button>
      </VStack>
    </VStack>
  );
}
