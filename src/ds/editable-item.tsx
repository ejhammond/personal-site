import React, { useCallback, useState } from 'react';
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
    api: Readonly<{ edit: () => void }>,
  ) => React.ReactNode;
}) {
  const [draftItem, setDraftItem] = useState<TItem | null>(null);

  const edit = useCallback(() => {
    setDraftItem(item);
  }, [item]);

  return (
    <>
      {renderItem(item, { edit })}
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
