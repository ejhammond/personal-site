'use client';

import { useState } from 'react';
import { Button } from '@/ds/button';
import { Menu, MenuItem } from '@/ds/menu';
import { KebabMenuIcon, PencilIcon, TrashIcon } from '@/ds/icons';
import { Dialog } from '@/ds/dialog';
import { Modal } from '@/ds/modal';
import { Form } from '@/ds/form';
import { FormEventContextProvider } from '@/ds/form/event-context';
import FormFooter from '@/ds/form/footer';
import { TextField } from '@/ds/text-field';
import { Counter } from '@/ds/counter';
import { VStack } from '@/ds/v-stack';
import { Text } from '@/ds/text';
import { Heading } from 'react-aria-components';
import {
  updateWorkout,
  deleteWorkout,
} from '../../__private__/workout-actions';

type Workout = {
  id: number;
  name: string;
  sets: number;
  reps: number;
};

export function WorkoutMenu({ workout }: { workout: Workout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [editData, setEditData] = useState({
    name: workout.name,
    sets: workout.sets,
    reps: workout.reps,
  });

  return (
    <>
      <Menu
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        button={
          <Button variant="flat" aria-label="Workout options">
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

      {isEditModalOpen && (
        <Modal
          isDismissable
          isOpen={isEditModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setIsEditModalOpen(false);
              setEditData({
                name: workout.name,
                sets: workout.sets,
                reps: workout.reps,
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
                    id="edit-workout"
                    isPending={isPending}
                    action={async () => {
                      setIsPending(true);
                      await updateWorkout(
                        {
                          name: editData.name,
                          sets: editData.sets,
                          reps: editData.reps,
                        },
                        { id: workout.id },
                      );
                      setIsPending(false);
                      close();
                    }}
                    footer={<FormFooter />}
                  >
                    <TextField
                      label="Name"
                      name="name"
                      value={editData.name}
                      onChange={(name) => setEditData((p) => ({ ...p, name }))}
                    />
                    <Counter
                      label="Sets"
                      value={editData.sets}
                      onChange={(sets) => setEditData((p) => ({ ...p, sets }))}
                      min={1}
                    />
                    <Counter
                      label="Reps"
                      value={editData.reps}
                      onChange={(reps) => setEditData((p) => ({ ...p, reps }))}
                      min={1}
                    />
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
                <Text>
                  Are you sure you want to delete this workout and all of the
                  logged data?
                </Text>
                <FormEventContextProvider onCancel={close}>
                  <Form
                    id="delete-workout"
                    isPending={isPending}
                    action={async () => {
                      setIsPending(true);
                      await deleteWorkout({ id: workout.id });
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
