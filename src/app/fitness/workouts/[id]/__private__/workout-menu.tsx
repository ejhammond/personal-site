'use client';

import {useState} from 'react';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {MoreMenu} from '@astryxdesign/core/MoreMenu';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {FormFooter} from '@/components/form-footer';
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

export function WorkoutMenu({workout}: {workout: Workout}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [editData, setEditData] = useState({
    name: workout.name,
    sets: workout.sets,
    reps: workout.reps,
  });

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData({
      name: workout.name,
      sets: workout.sets,
      reps: workout.reps,
    });
  };

  return (
    <>
      <MoreMenu
        label="Workout options"
        alignment="end"
        items={[
          {
            label: 'Edit',
            onClick: () => setIsEditModalOpen(true),
          },
          {
            label: 'Delete',
            onClick: () => setIsDeleteModalOpen(true),
            variant: 'destructive',
          },
        ]}
      />

      <Dialog
        isOpen={isEditModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeEditModal();
          }
        }}
      >
        <DialogHeader title="Edit Workout" onOpenChange={closeEditModal} />
        <VStack gap={4} padding={4}>
          <form
            id="edit-workout"
            onSubmit={(event) => {
              event.preventDefault();
              void (async () => {
                setIsPending(true);
                await updateWorkout(
                  {
                    name: editData.name,
                    sets: editData.sets,
                    reps: editData.reps,
                  },
                  {id: workout.id},
                );
                setIsPending(false);
                setIsEditModalOpen(false);
              })();
            }}
          >
            <VStack gap={3}>
              <TextInput
                label="Name"
                htmlName="name"
                value={editData.name}
                onChange={(name) => setEditData((p) => ({...p, name}))}
              />
              <NumberInput
                label="Sets"
                value={editData.sets}
                onChange={(sets) => setEditData((p) => ({...p, sets}))}
                min={1}
                isIntegerOnly
                hasNumberSteppers
              />
              <NumberInput
                label="Reps"
                value={editData.reps}
                onChange={(reps) => setEditData((p) => ({...p, reps}))}
                min={1}
                isIntegerOnly
                hasNumberSteppers
              />
              <FormFooter isPending={isPending} onCancel={closeEditModal} />
            </VStack>
          </form>
        </VStack>
      </Dialog>

      <Dialog isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogHeader
          title="Delete Workout"
          onOpenChange={setIsDeleteModalOpen}
        />
        <VStack gap={4} padding={4}>
          <Text>
            Are you sure you want to delete this workout and all of the
            logged data?
          </Text>
          <form
            id="delete-workout"
            onSubmit={(event) => {
              event.preventDefault();
              void (async () => {
                setIsPending(true);
                await deleteWorkout({id: workout.id});
                setIsPending(false);
                setIsDeleteModalOpen(false);
              })();
            }}
          >
            <VStack gap={3}>
              <FormFooter
                isPending={isPending}
                onCancel={() => setIsDeleteModalOpen(false)}
              />
            </VStack>
          </form>
        </VStack>
      </Dialog>
    </>
  );
}
