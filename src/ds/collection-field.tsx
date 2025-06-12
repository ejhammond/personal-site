import React from 'react';
import { Button } from './button';
import { VStack } from './v-stack';
import { Label } from './label';
import EditableItem from './editable-item';

export default function CollectionField<TItem extends { id: string }>({
  itemName,
  itemNamePlural,
  items,
  onAdd,
  onRemove,
  renderEditFormFields,
  renderItem,
  initializeDraftItem,
  sortItems,
}: {
  itemName: string;
  itemNamePlural?: string;
  items: TItem[];
  onAdd: (item: TItem) => void;
  onRemove: (id: string) => void;
  renderEditFormFields: (
    draftItem: TItem,
    setDraftItem: (item: TItem) => void,
  ) => React.ReactNode;
  renderItem: (item: TItem) => React.ReactNode;
  initializeDraftItem: () => TItem;
  sortItems?: (a: TItem, b: TItem) => number;
}) {
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
                renderEditFormFields={renderEditFormFields}
                renderItem={renderItem}
                onUpdate={onAdd}
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
