'use client';

import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {VStack} from '@astryxdesign/core/Stack';
import {useState} from 'react';
import {deleteLoan, DeleteLoanActionState} from './loan-actions';
import {FormFooter} from '@/components/form-footer';

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
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader title="Delete mortgage?" onOpenChange={onOpenChange} />
      <VStack gap={4} padding={4}>
        <form
          id="delete"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
              setIsPending(true);
              setActionState({});
              const state = await deleteLoan({
                id: parseInt(loanID, 10),
              });
              setActionState(state);
              setIsPending(false);
            })();
          }}
        >
          <VStack gap={3}>
            <FormFooter
              isPending={isPending}
              submitLabel="Delete mortgage"
              submitVariant="destructive"
              errorMessage={actionState.errors?.form}
              onCancel={() => onOpenChange(false)}
            />
          </VStack>
        </form>
      </VStack>
    </Dialog>
  );
}
