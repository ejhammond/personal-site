'use client';

import { useState } from 'react';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Icon } from '@astryxdesign/core/Icon';
import { ListItem } from '@astryxdesign/core/List';
import { MoreMenu } from '@astryxdesign/core/MoreMenu';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Selector } from '@astryxdesign/core/Selector';
import { Text } from '@astryxdesign/core/Text';
import { FormFooter } from '@/components/form-footer';
import {
  updateWorkoutInstance,
  deleteWorkoutInstance,
  UpdateWorkoutInstanceActionState,
  DeleteWorkoutInstanceActionState,
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

function EqualsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="9" width="16" height="2" rx="1" />
      <rect x="4" y="13" width="16" height="2" rx="1" />
    </svg>
  );
}

function SignalIcon({ signal }: { signal: Signal }) {
  if (signal === 'INCREASE') {
    return (
      <Icon icon="arrowUp" size="lg" color="success" label="Increase weight" />
    );
  }

  if (signal === 'DECREASE') {
    return (
      <Icon icon="arrowDown" size="lg" color="error" label="Decrease weight" />
    );
  }

  return <Icon icon={EqualsIcon} size="lg" label="Maintain weight" />;
}

export function WorkoutInstanceItem({
  instance,
}: {
  instance: WorkoutInstance;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [editState, setEditState] = useState<UpdateWorkoutInstanceActionState>(
    {},
  );
  const [deleteState, setDeleteState] =
    useState<DeleteWorkoutInstanceActionState>({});

  const [editData, setEditData] = useState({
    weight: instance.weight,
    signal: instance.signal,
    timestamp: instance.timestamp,
  });

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData({
      weight: instance.weight,
      signal: instance.signal,
      timestamp: instance.timestamp,
    });
  };

  return (
    <>
      <ListItem
        label={
          <Text size="2xl" weight="bold">
            {instance.weight} lbs
          </Text>
        }
        description={new Date(instance.timestamp).toLocaleString()}
        endContent={
          <HStack gap={2} vAlign="center">
            <SignalIcon signal={instance.signal} />
            <MoreMenu
              label="Options"
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
          </HStack>
        }
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
            id="edit-workout-instance"
            onSubmit={(event) => {
              event.preventDefault();
              void (async () => {
                setIsPending(true);
                setEditState({});
                const state = await updateWorkoutInstance(
                  {
                    weight: editData.weight,
                    signal: editData.signal,
                    timestamp: editData.timestamp,
                  },
                  { id: instance.id },
                );
                setEditState(state);
                setIsPending(false);
                // Only close on success; on failure the dialog stays open
                // with the error in the footer.
                if (state.errors == null) {
                  setIsEditModalOpen(false);
                }
              })();
            }}
          >
            <VStack gap={3}>
              <NumberInput
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
              <Selector
                label="Next Workout"
                value={editData.signal}
                onChange={(value) =>
                  setEditData((p) => ({
                    ...p,
                    signal: value as Signal,
                  }))
                }
                options={SIGNAL_ITEMS}
              />
              <FormFooter
                isPending={isPending}
                errorMessage={editState.errors?.form}
                onCancel={closeEditModal}
              />
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
          <Text>Are you sure you want to delete this workout?</Text>
          <form
            id="delete-workout-instance"
            onSubmit={(event) => {
              event.preventDefault();
              void (async () => {
                setIsPending(true);
                setDeleteState({});
                const state = await deleteWorkoutInstance({
                  id: instance.id,
                });
                setDeleteState(state);
                setIsPending(false);
                // Only close on success; on failure the dialog stays open
                // with the error in the footer.
                if (state.errors == null) {
                  setIsDeleteModalOpen(false);
                }
              })();
            }}
          >
            <VStack gap={3}>
              <FormFooter
                isPending={isPending}
                errorMessage={deleteState.errors?.form}
                onCancel={() => setIsDeleteModalOpen(false)}
              />
            </VStack>
          </form>
        </VStack>
      </Dialog>
    </>
  );
}
