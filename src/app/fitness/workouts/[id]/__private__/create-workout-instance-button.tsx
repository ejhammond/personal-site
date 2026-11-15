'use client';

import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {VStack} from '@astryxdesign/core/Stack';
import {useState} from 'react';
import {insertWorkoutInstance} from './workout-instance-actions';
import {FormFooter} from '@/components/form-footer';

type Signal = 'INCREASE' | 'MAINTAIN' | 'DECREASE';

const SIGNAL_ITEMS = [
  {label: 'Increase weight', value: 'INCREASE' as Signal},
  {label: 'Maintain weight', value: 'MAINTAIN' as Signal},
  {label: 'Decrease weight', value: 'DECREASE' as Signal},
];

const defaultInstance = {
  signal: 'MAINTAIN' as Signal,
  weight: 20,
  timestamp: new Date().toISOString(),
};

export function CreateWorkoutInstanceButton({
  workoutID,
}: {
  workoutID: string;
}) {
  const [draftInstance, setDraftInstance] = useState<{
    signal: Signal;
    weight: number;
    timestamp: string;
  } | null>(null);

  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <Button
        label="Log Workout"
        variant="primary"
        onClick={() => setDraftInstance(defaultInstance)}
      />

      <Dialog
        isOpen={draftInstance != null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDraftInstance(null);
          }
        }}
      >
        <DialogHeader
          title="Log Workout"
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDraftInstance(null);
            }
          }}
        />
        {draftInstance != null && (
          <VStack gap={4} padding={4}>
            <form
              id="create-workout-instance"
              onSubmit={(event) => {
                event.preventDefault();
                void (async () => {
                  setIsPending(true);
                  await insertWorkoutInstance({
                    workout_id: Number(workoutID),
                    signal: draftInstance.signal,
                    timestamp: draftInstance.timestamp,
                    weight: draftInstance.weight,
                  });
                  setIsPending(false);
                  setDraftInstance(null);
                })();
              }}
            >
              <VStack gap={3}>
                <NumberInput
                  label="Weight"
                  isRequired
                  value={draftInstance.weight}
                  onChange={(value) =>
                    setDraftInstance((p) => ({
                      ...(p ?? defaultInstance),
                      weight: value,
                    }))
                  }
                />
                <Selector
                  label="Next Workout"
                  value={draftInstance.signal}
                  onChange={(value) =>
                    setDraftInstance((p) => ({
                      ...(p ?? defaultInstance),
                      signal: value as Signal,
                    }))
                  }
                  options={SIGNAL_ITEMS}
                />
                <FormFooter
                  isPending={isPending}
                  onCancel={() => setDraftInstance(null)}
                />
              </VStack>
            </form>
          </VStack>
        )}
      </Dialog>
    </>
  );
}
