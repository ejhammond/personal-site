import React from 'react';
import { VStack } from './v-stack';
import { Label } from './label';
import EditableItem from './editable-item';

export default function EditableItemField<TItem>({
  itemName,
  ...delegated
}: React.ComponentProps<typeof EditableItem<TItem>>) {
  return (
    <VStack gap="sm">
      <Label>{itemName}</Label>
      <div style={{ paddingInlineStart: '16px' }}>
        <EditableItem itemName={itemName} {...delegated} />
      </div>
    </VStack>
  );
}
