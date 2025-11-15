'use client';

import { Button } from '@/ds/button';
import { Dialog } from '@/ds/dialog';
import { Form } from '@/ds/form';
import { FormEventContextProvider } from '@/ds/form/event-context';
import FormFooter from '@/ds/form/footer';
import { Modal } from '@/ds/modal';
import { NumberField } from '@/ds/number-field';
import { Select, SelectItem } from '@/ds/select';
import { VStack } from '@/ds/v-stack';
import { useState } from 'react';
import { Heading } from 'react-aria-components';
import { insertWorkoutInstance } from './workout-instance-actions';

type Signal = 'INCREASE' | 'MAINTAIN' | 'DECREASE';

const SIGNAL_ITEMS = [
  { label: 'Increase weight', value: 'INCREASE' as Signal },
  { label: 'Maintain weight', value: 'MAINTAIN' as Signal },
  { label: 'Decrease weight', value: 'DECREASE' as Signal },
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
        variant="primary"
        onClick={() => {
          setDraftInstance(defaultInstance);
        }}
      >
        Log Workout
      </Button>
      {draftInstance != null && (
        <Modal
          isDismissable
          isOpen={draftInstance != null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDraftInstance(null);
            }
          }}
        >
          <Dialog>
            {({ close }) => (
              <VStack gap="md">
                <Heading slot="title">Log Workout</Heading>
                <FormEventContextProvider onCancel={close}>
                  <Form
                    id="create-workout-instance"
                    isPending={isPending}
                    action={async () => {
                      setIsPending(true);
                      await insertWorkoutInstance({
                        workout_id: Number(workoutID),
                        signal: draftInstance.signal,
                        timestamp: draftInstance.timestamp,
                        weight: draftInstance.weight,
                      });
                      setIsPending(false);
                      close();
                    }}
                    footer={<FormFooter />}
                  >
                    <NumberField
                      label="Weight"
                      isRequired
                      value={draftInstance.weight}
                      hasSelectOnFocus
                      onChange={(value) =>
                        setDraftInstance((p) => ({
                          ...(p ?? defaultInstance),
                          weight: value,
                        }))
                      }
                    />
                    <Select
                      label="Next Workout"
                      selectedKey={draftInstance.signal}
                      onSelectionChange={(value) =>
                        setDraftInstance((p) => ({
                          ...(p ?? defaultInstance),
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
    </>
  );
}
