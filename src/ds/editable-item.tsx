import React, { useState } from 'react';
import { Button } from './button';
import { HStack } from './h-stack';
import { VStack } from './v-stack';
import { Modal } from './modal';
import { Dialog } from './dialog';
import { Heading } from 'react-aria-components';
import { FormEventContextProvider } from './form/event-context';

export default function EditableItem<TItem>({
  itemName,
  item,
  renderEditForm,
  renderItem,
  onRemove,
  isPending = false,
  hasError = false,
}: {
  itemName: string;
  isPending?: boolean;
  hasError?: boolean;
  onRemove?: () => void;
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
    meta: Readonly<{ isPending: boolean }>,
  ) => React.ReactNode;
}) {
  const [draftItem, setDraftItem] = useState<TItem | null>(null);

  return (
    <>
      <HStack gap="sm" vAlign="center">
        {renderItem(item, { isPending })}
        <HStack>
          <Button
            variant="flat"
            onPress={() => setDraftItem(item)}
            isPending={isPending}
            cornerIndicator={
              hasError ? { type: 'error', label: 'Error' } : undefined
            }
          >
            Edit
          </Button>
          {onRemove != null && (
            <Button
              variant="flat"
              onPress={() => onRemove()}
              isPending={isPending}
            >
              Remove
            </Button>
          )}
        </HStack>
      </HStack>
      {draftItem != null && (
        <Modal
          isDismissable
          isOpen={draftItem != null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDraftItem(null);
            }
          }}
        >
          <Dialog>
            {({ close }) => (
              <VStack gap="md">
                <Heading slot="title">{itemName}</Heading>
                <FormEventContextProvider onCancel={close}>
                  {renderEditForm({ draftItem, setDraftItem, close })}
                </FormEventContextProvider>
              </VStack>
            )}
          </Dialog>
        </Modal>
      )}
    </>
  );
}
