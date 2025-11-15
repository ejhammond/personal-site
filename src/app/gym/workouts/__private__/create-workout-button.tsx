'use client';

import { Button } from '@/ds/button';
import { Counter } from '@/ds/counter';
import { Dialog } from '@/ds/dialog';
import { Form } from '@/ds/form';
import { FormEventContextProvider } from '@/ds/form/event-context';
import FormFooter from '@/ds/form/footer';
import { Modal } from '@/ds/modal';
import { TextField } from '@/ds/text-field';
import { VStack } from '@/ds/v-stack';
import { useState } from 'react';
import { Heading } from 'react-aria-components';
import { insertWorkout } from './workout-actions';

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
        variant="primary"
        onClick={() => {
          setDraftWorkout(defaultWorkout);
        }}
      >
        Create
      </Button>
      {draftWorkout != null && (
        <Modal
          isDismissable
          isOpen={draftWorkout != null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDraftWorkout(null);
            }
          }}
        >
          <Dialog>
            {({ close }) => (
              <VStack gap="md">
                <Heading slot="title">Create Workout</Heading>
                <FormEventContextProvider onCancel={close}>
                  <Form
                    id="create-workout"
                    isPending={isPending}
                    action={async () => {
                      setIsPending(true);
                      await insertWorkout({
                        name: draftWorkout.name,
                        sets: draftWorkout.sets,
                        reps: draftWorkout.reps,
                      });
                      setIsPending(false);
                      close();
                    }}
                    footer={<FormFooter />}
                  >
                    <TextField
                      label="Name"
                      name="name"
                      value={draftWorkout.name}
                      onChange={(name) =>
                        setDraftWorkout((p) => ({
                          ...(p ?? defaultWorkout),
                          name,
                        }))
                      }
                    />
                    <Counter
                      label="Sets"
                      value={draftWorkout.sets}
                      onChange={(sets) =>
                        setDraftWorkout((p) => ({
                          ...(p ?? defaultWorkout),
                          sets,
                        }))
                      }
                      min={1}
                    />
                    <Counter
                      label="Reps"
                      value={draftWorkout.reps}
                      onChange={(reps) =>
                        setDraftWorkout((p) => ({
                          ...(p ?? defaultWorkout),
                          reps,
                        }))
                      }
                      min={1}
                    />
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
