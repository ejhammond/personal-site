'use client';

import { Dialog } from '@/ds/dialog';
import { Form } from '@/ds/form';
import { FormEventContextProvider } from '@/ds/form/event-context';
import { Modal } from '@/ds/modal';
import { VStack } from '@/ds/v-stack';
import { useState } from 'react';
import { Heading } from 'react-aria-components';
import { deleteLoan, DeleteLoanActionState } from './loan-actions';
import FormFooter from '@/ds/form/footer';
import FormSubmitButton from '@/ds/form/submit-button';

export function DeleteLoanModal({
  isOpen,
  onOpenChange,
  loanID,
}: Readonly<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loanID: string;
}>) {
  const [actionState, setActionState] = useState<DeleteLoanActionState>({});
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <Modal isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <VStack gap="md">
            <Heading slot="title">Delete mortgage?</Heading>
            <FormEventContextProvider onCancel={close}>
              <Form
                id="delete"
                isPending={isPending}
                action={async () => {
                  setIsPending(true);
                  setActionState({});
                  const state = await deleteLoan({
                    id: parseInt(loanID, 10),
                  });
                  setActionState(state);
                  setIsPending(false);
                }}
                footer={
                  <FormFooter
                    errorMessage={actionState.errors?.form}
                    submitButton={
                      <FormSubmitButton variant="danger">
                        Delete mortgage
                      </FormSubmitButton>
                    }
                  />
                }
              />
            </FormEventContextProvider>
          </VStack>
        )}
      </Dialog>
    </Modal>
  );
}
