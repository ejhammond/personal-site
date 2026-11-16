'use client';

import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { VStack } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { useState } from 'react';
import { renameLoan, RenameLoanActionState } from './loan-actions';
import { FormFooter } from '@/components/form-footer';

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
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader title="Rename mortgage" onOpenChange={onOpenChange} />
      <VStack gap={4} padding={4}>
        <form
          id="rename"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
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

              // Only close on success; on failure the dialog stays open
              // with the error in the footer.
              if (state.errors == null) {
                onOpenChange(false);
              }
            })();
          }}
        >
          <VStack gap={3}>
            <TextInput label="Name" value={name} onChange={setName} />
            <FormFooter
              isPending={isPending}
              submitLabel="Rename mortgage"
              errorMessage={actionState.errors?.form}
              onCancel={() => onOpenChange(false)}
            />
          </VStack>
        </form>
      </VStack>
    </Dialog>
  );
}
