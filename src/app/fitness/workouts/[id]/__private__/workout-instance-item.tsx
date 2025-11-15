'use client';

import { useState } from 'react';
import { HStack } from '@/ds/h-stack';
import { Text } from '@/ds/text';
import { Button } from '@/ds/button';
import { Menu, MenuItem } from '@/ds/menu';
import { KebabMenuIcon, PencilIcon, TrashIcon } from '@/ds/icons';
import { ArrowUpIcon, ArrowDownIcon, EqualsIcon } from '@/ds/icons';
import { Dialog } from '@/ds/dialog';
import { Modal } from '@/ds/modal';
import { Form } from '@/ds/form';
import { FormEventContextProvider } from '@/ds/form/event-context';
import FormFooter from '@/ds/form/footer';
import { NumberField } from '@/ds/number-field';
import { Select, SelectItem } from '@/ds/select';
import { VStack } from '@/ds/v-stack';
import { Heading } from 'react-aria-components';
import {
  updateWorkoutInstance,
  deleteWorkoutInstance,
} from './workout-instance-actions';

type Signal = 'INCREASE' | 'MAINTAIN' | 'DECREASE';

const SIGNAL_ITEMS = [
  { label: 'Increase weight', value: 'INCREASE' as Signal },
  { label: 'Maintain weight', value: 'MAINTAIN' as Signal },
  { label: 'Decrease weight', value: 'DECREASE' as Signal },
];

type WorkoutInstance = {
  id: number;
  weight: number;
  timestamp: string;
  signal: Signal;
};

export function WorkoutInstanceItem({
  instance,
}: {
  instance: WorkoutInstance;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [editData, setEditData] = useState({
    weight: instance.weight,
    signal: instance.signal,
    timestamp: instance.timestamp,
  });

  const SignalIcon =
    instance.signal === 'INCREASE'
      ? ArrowUpIcon
      : instance.signal === 'DECREASE'
        ? ArrowDownIcon
        : EqualsIcon;

  const iconColor =
    instance.signal === 'INCREASE'
      ? 'var(--positive-color)'
      : instance.signal === 'DECREASE'
        ? 'var(--negative-color)'
        : undefined;

  return (
    <>
      <HStack
        gap="md"
        vAlign="center"
        style={{
          padding: '12px',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            {instance.weight} lbs
          </Text>
          <Text
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
            }}
          >
            {new Date(instance.timestamp).toLocaleString()}
          </Text>
        </div>
        <SignalIcon
          size={24}
          style={iconColor ? { color: iconColor } : undefined}
        />
        <Menu
          isOpen={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          button={
            <Button
              variant="flat"
              onPress={() => setIsMenuOpen(true)}
              aria-label="Options"
            >
              <KebabMenuIcon />
            </Button>
          }
        >
          <MenuItem
            onAction={() => {
              setIsMenuOpen(false);
              setIsEditModalOpen(true);
            }}
          >
            <PencilIcon />
          </MenuItem>
          <MenuItem
            onAction={() => {
              setIsMenuOpen(false);
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon />
          </MenuItem>
        </Menu>
      </HStack>

      {isEditModalOpen && (
        <Modal
          isDismissable
          isOpen={isEditModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setIsEditModalOpen(false);
              setEditData({
                weight: instance.weight,
                signal: instance.signal,
                timestamp: instance.timestamp,
              });
            }
          }}
        >
          <Dialog>
            {({ close }) => (
              <VStack gap="md">
                <Heading slot="title">Edit Workout</Heading>
                <FormEventContextProvider onCancel={close}>
                  <Form
                    id="edit-workout-instance"
                    isPending={isPending}
                    action={async () => {
                      setIsPending(true);
                      await updateWorkoutInstance(
                        {
                          weight: editData.weight,
                          signal: editData.signal,
                          timestamp: editData.timestamp,
                        },
                        { id: instance.id },
                      );
                      setIsPending(false);
                      close();
                    }}
                    footer={<FormFooter />}
                  >
                    <NumberField
                      label="Weight"
                      isRequired
                      value={editData.weight}
                      onChange={(value) =>
                        setEditData((p) => ({
                          ...p,
                          weight: value ?? 0,
                        }))
                      }
                    />
                    <Select
                      label="Next Workout"
                      selectedKey={editData.signal}
                      onSelectionChange={(value) =>
                        setEditData((p) => ({
                          ...p,
                          signal: value as Signal,
                        }))
                      }
                      items={SIGNAL_ITEMS}
                    >
                      {(item) => (
                        <SelectItem id={item.value}>{item.label}</SelectItem>
                      )}
                    </Select>
                  </Form>
                </FormEventContextProvider>
              </VStack>
            )}
          </Dialog>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          isDismissable
          isOpen={isDeleteModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setIsDeleteModalOpen(false);
            }
          }}
        >
          <Dialog>
            {({ close }) => (
              <VStack gap="md">
                <Heading slot="title">Delete Workout</Heading>
                <Text>Are you sure you want to delete this workout?</Text>
                <FormEventContextProvider onCancel={close}>
                  <Form
                    id="delete-workout-instance"
                    isPending={isPending}
                    action={async () => {
                      setIsPending(true);
                      await deleteWorkoutInstance({ id: instance.id });
                      setIsPending(false);
                      close();
                    }}
                    footer={<FormFooter />}
                  />
                </FormEventContextProvider>
              </VStack>
            )}
          </Dialog>
        </Modal>
      )}
    </>
  );
}
