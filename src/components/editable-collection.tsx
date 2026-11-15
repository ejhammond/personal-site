'use client';

import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {MoreMenu} from '@astryxdesign/core/MoreMenu';
import {HStack, StackItem, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {WithID} from '@/utils/id';
import React, {useCallback, useState} from 'react';

/**
 * Astryx replacements for the old ds editable-item / editable-card /
 * collection-field / editable-item-field family. Same props and behavior:
 * items render as cards with an edit affordance; editing opens a modal
 * dialog with the edit form; collections add an "Add {item}" button.
 */

export function EditableCard({
  isPending = false,
  onEdit,
  onRemove,
  children,
}: {
  isPending?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  let action: React.ReactNode = null;

  if (onEdit != null && onRemove == null) {
    action = <Button label="Edit" variant="ghost" onClick={onEdit} />;
  } else if (onRemove != null && onEdit == null) {
    action = <Button label="Remove" variant="ghost" onClick={onRemove} />;
  } else if (onEdit != null && onRemove != null) {
    action = (
      <MoreMenu
        label="Options"
        alignment="end"
        items={[
          {label: 'Edit', onClick: onEdit},
          {label: 'Remove', onClick: onRemove, variant: 'destructive'},
        ]}
      />
    );
  }

  return (
    <Card>
      <HStack gap={2} vAlign="start">
        <StackItem size="fill">
          <VStack style={isPending ? {opacity: 0.55} : undefined}>
            {children}
          </VStack>
        </StackItem>
        {action}
      </HStack>
    </Card>
  );
}

export function EditableItem<TItem>({
  itemName,
  item,
  renderEditForm,
  renderItem,
}: {
  itemName: string;
  item: TItem;
  renderEditForm: (
    args: Readonly<{
      draftItem: TItem;
      setDraftItem: (item: TItem) => void;
      close: () => void;
    }>,
  ) => React.ReactNode;
  renderItem: (
    item: TItem,
    api: Readonly<{edit: () => void}>,
  ) => React.ReactNode;
}) {
  const [draftItem, setDraftItem] = useState<TItem | null>(null);

  const edit = useCallback(() => {
    setDraftItem(item);
  }, [item]);

  const close = useCallback(() => {
    setDraftItem(null);
  }, []);

  return (
    <>
      {renderItem(item, {edit})}
      <Dialog
        isOpen={draftItem != null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDraftItem(null);
          }
        }}
      >
        <DialogHeader title={itemName} onOpenChange={close} />
        {draftItem != null && (
          <VStack gap={4} padding={4}>
            {renderEditForm({draftItem, setDraftItem, close})}
          </VStack>
        )}
      </Dialog>
    </>
  );
}

export function EditableItemField<TItem>({
  itemName,
  ...delegated
}: React.ComponentProps<typeof EditableItem<TItem>>) {
  return (
    <VStack gap={2}>
      <Text type="label">{itemName}</Text>
      <EditableItem itemName={itemName} {...delegated} />
    </VStack>
  );
}

export function CollectionField<TItem extends WithID<unknown>>({
  itemName,
  itemNamePlural,
  items,
  onAdd,
  renderEditForm,
  renderItem,
  initializeDraftItem,
  sortItems,
}: {
  itemName: string;
  itemNamePlural?: string;
  items: TItem[];
  onAdd: (item: TItem) => void;
  initializeDraftItem: () => TItem;
  sortItems?: (a: TItem, b: TItem) => number;
} & Omit<React.ComponentProps<typeof EditableItem<TItem>>, 'item'>) {
  return (
    <VStack gap={2}>
      <Text type="label">{itemNamePlural ?? `${itemName}s`}</Text>
      {items.length > 0 && (
        <VStack gap={2}>
          {items.toSorted(sortItems).map((item) => (
            <EditableItem
              key={item.id}
              itemName={itemName}
              item={item}
              renderEditForm={renderEditForm}
              renderItem={renderItem}
            />
          ))}
        </VStack>
      )}
      <Button
        label={`Add ${itemName.toLowerCase()}`}
        variant="secondary"
        type="button"
        onClick={() => onAdd(initializeDraftItem())}
      />
    </VStack>
  );
}
