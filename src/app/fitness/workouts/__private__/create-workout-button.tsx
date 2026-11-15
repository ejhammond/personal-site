'use client';

import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {VStack} from '@astryxdesign/core/Stack';
import {TextInput} from '@astryxdesign/core/TextInput';
import {useState} from 'react';
import {insertWorkout} from './workout-actions';
import {FormFooter} from '@/components/form-footer';

const defaultWorkout = {
  name: '',
  sets: 3,
  reps: 5,
};

export function CreateWorkoutButton() {
  const [draftWorkout, setDraftWorkout] = useState<{
    name: string;
    sets: number;
    reps: number;
  } | null>(null);

  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <Button
        label="Create"
        variant="primary"
        onClick={() => {
          setDraftWorkout(defaultWorkout);
        }}
      />
      <Dialog
        isOpen={draftWorkout != null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDraftWorkout(null);
          }
        }}
      >
        <DialogHeader
          title="Create Workout"
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDraftWorkout(null);
            }
          }}
        />
        {draftWorkout != null && (
          <VStack gap={4} padding={4}>
            <form
              id="create-workout"
              onSubmit={(event) => {
                event.preventDefault();
                void (async () => {
                  setIsPending(true);
                  await insertWorkout({
                    name: draftWorkout.name,
                    sets: draftWorkout.sets,
                    reps: draftWorkout.reps,
                  });
                  setIsPending(false);
                  setDraftWorkout(null);
                })();
              }}
            >
              <VStack gap={3}>
                <TextInput
                  label="Name"
                  htmlName="name"
                  value={draftWorkout.name}
                  onChange={(name) =>
                    setDraftWorkout((p) => ({
                      ...(p ?? defaultWorkout),
                      name,
                    }))
                  }
                />
                <NumberInput
                  label="Sets"
                  value={draftWorkout.sets}
                  onChange={(sets) =>
                    setDraftWorkout((p) => ({
                      ...(p ?? defaultWorkout),
                      sets,
                    }))
                  }
                  min={1}
                  isIntegerOnly
                  hasNumberSteppers
                />
                <NumberInput
                  label="Reps"
                  value={draftWorkout.reps}
                  onChange={(reps) =>
                    setDraftWorkout((p) => ({
                      ...(p ?? defaultWorkout),
                      reps,
                    }))
                  }
                  min={1}
                  isIntegerOnly
                  hasNumberSteppers
                />
                <FormFooter
                  isPending={isPending}
                  onCancel={() => setDraftWorkout(null)}
                />
              </VStack>
            </form>
          </VStack>
        )}
      </Dialog>
    </>
  );
}
