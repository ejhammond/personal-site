import React, { useState } from 'react';
import { Button } from './button';
import { HStack } from './h-stack';
import { VStack } from './v-stack';
import { Form } from './form';
import { idify } from '@/utils/id';
import { Modal } from './modal';
import { Dialog } from './dialog';
import { Heading } from 'react-aria-components';

export default function EditableItem<TItem>({
  itemName,
  item,
  renderEditFormFields,
  renderItem,
  onRemove,
  onUpdate,
}: {
  itemName: string;
  onRemove?: () => void;
  item: TItem;
  onUpdate: (item: TItem) => void;
  renderEditFormFields: (
    draftItem: TItem,
    setDraftItem: (item: TItem) => void,
  ) => React.ReactNode;
  renderItem: (item: TItem) => React.ReactNode;
}) {
  const formID = idify(itemName + '-form');
  const [draftItem, setDraftItem] = useState<TItem | null>(null);

  return (
    <>
      <HStack gap="sm" vAlign="center">
        {renderItem(item)}
        <HStack>
          <Button variant="flat" onPress={() => setDraftItem(item)}>
            Edit
          </Button>
          {onRemove != null && (
            <Button variant="flat" onPress={() => onRemove()}>
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
                <Form
                  id={formID}
                  onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    onUpdate(draftItem);
                    close();
                  }}
                  footer={
                    <HStack
                      gap="sm"
                      style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        type="button"
                        variant="flat"
                        onPress={close}
                        form={formID}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" form={formID}>
                        Save
                      </Button>
                    </HStack>
                  }
                >
                  {renderEditFormFields(draftItem, setDraftItem)}
                </Form>
              </VStack>
            )}
          </Dialog>
        </Modal>
      )}
    </>
  );
}
