import React, { useState } from 'react';
import { Button } from './button';
import { HStack } from './h-stack';
import { VStack } from './v-stack';
import { Form } from './form';
import { idify } from '@/utils/id';
import { Modal } from './modal';
import { Dialog } from './dialog';
import { Heading } from 'react-aria-components';

export default function Collection<TItem extends { id: string }>({
  itemName,
  itemNamePlural,
  items,
  onAdd,
  onRemove,
  renderEditFormFields,
  renderItem,
  initializeDraftItem,
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
}) {
  const formID = idify(itemName + '-form');
  const [draftItem, setDraftItem] = useState<TItem | null>(null);

  return (
    <>
      <VStack gap="xs" hAlign="start">
        {itemNamePlural ?? `${itemName}s`}
        <ul>
          {items.map((item) => (
            <li key={item.id}>
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
            </li>
          ))}
        </ul>
        <Button
          type="button"
          onPress={() => setDraftItem(initializeDraftItem())}
        >
          Add {itemName.toLowerCase()}
        </Button>
      </VStack>
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

                    onAdd(draftItem);
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
