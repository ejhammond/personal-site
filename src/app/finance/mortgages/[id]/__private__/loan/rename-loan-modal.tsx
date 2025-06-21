'use client';

import { Dialog } from '@/ds/dialog';
import { Form } from '@/ds/form';
import { FormEventContextProvider } from '@/ds/form/event-context';
import { Modal } from '@/ds/modal';
import { VStack } from '@/ds/v-stack';
import { useState } from 'react';
import { Heading } from 'react-aria-components';
import { renameLoan, RenameLoanActionState } from './loan-actions';
import FormFooter from '@/ds/form/footer';
import FormSubmitButton from '@/ds/form/submit-button';
import { TextField } from '@/ds/text-field';

export function RenameLoanModal({
  isOpen,
  onOpenChange,
  loanID,
  initialName,
}: Readonly<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loanID: string;
  initialName: string;
}>) {
  const [actionState, setActionState] = useState<RenameLoanActionState>({});
  const [isPending, setIsPending] = useState<boolean>(false);

  const [name, setName] = useState(initialName);

  return (
    <Modal isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <VStack gap="md">
            <Heading slot="title">Rename mortgage</Heading>
            <FormEventContextProvider onCancel={close}>
              <Form
                id="rename"
                isPending={isPending}
                action={async () => {
                  setIsPending(true);
                  setActionState({});
                  const state = await renameLoan(
                    { name },
                    {
                      id: parseInt(loanID, 10),
                    },
                  );
                  setActionState(state);
                  setIsPending(false);

                  close();
                }}
                validationErrors={actionState.errors}
                footer={
                  <FormFooter
                    errorMessage={actionState.errors?.form}
                    submitButton={
                      <FormSubmitButton>Rename mortgage</FormSubmitButton>
                    }
                  />
                }
              >
                <TextField label="Name" value={name} onChange={setName} />
              </Form>
            </FormEventContextProvider>
          </VStack>
        )}
      </Dialog>
    </Modal>
  );
}
