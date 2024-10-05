import { useState } from 'react';
import { Button } from './button';
import { HStack } from './h-stack';
import { VStack } from './v-stack';

export default function Collection<TItem extends { id: string }>({
  itemName,
  itemNamePlural,
  items,
  onAdd,
  onRemove,
  renderEditForm,
  renderItem,
  initializeDraftItem,
}: {
  itemName: string;
  itemNamePlural?: string;
  items: TItem[];
  onAdd: (item: TItem) => void;
  onRemove: (id: string) => void;
  renderEditForm: (
    draftItem: TItem,
    setDraftItem: (item: TItem) => void,
  ) => React.ReactNode;
  renderItem: (item: TItem) => React.ReactNode;
  initializeDraftItem: () => TItem;
}) {
  const [draftItem, setDraftItem] = useState<TItem | null>(null);

  const editForm = draftItem != null && (
    <VStack>
      {renderEditForm(draftItem, setDraftItem)}
      <HStack gap="sm">
        <Button
          variant="flat"
          onPress={() => {
            onAdd(draftItem);
            setDraftItem(null);
          }}
        >
          Save
        </Button>
        <Button variant="flat" onPress={() => setDraftItem(null)}>
          Cancel
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <VStack gap="sm" hAlign="start">
      {itemNamePlural ?? `${itemName}s`}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.id === draftItem?.id ? (
              editForm
            ) : (
              <HStack gap="sm" vAlign="center">
                {renderItem(item)}
                <HStack>
                  <Button variant="flat" onPress={() => setDraftItem(item)}>
                    Edit
                  </Button>
                  <Button variant="flat" onPress={() => onRemove(item.id)}>
                    Remove
                  </Button>
                </HStack>
              </HStack>
            )}
          </li>
        ))}
      </ul>
      {draftItem != null &&
        items.every((item) => item.id !== draftItem.id) &&
        editForm}
      {draftItem == null && (
        <Button onPress={() => setDraftItem(initializeDraftItem())}>
          Add {itemName.toLowerCase()}
        </Button>
      )}
    </VStack>
  );
}
