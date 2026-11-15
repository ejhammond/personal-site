'use client';

import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { VStack } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { useState } from 'react';
import { insertLoan } from '../[id]/__private__/loan/loan-actions';
import { FormFooter } from '@/components/form-footer';

export function CreateMortgageButton() {
  const [draftMortgage, setDraftMortgage] = useState<{ name: string } | null>(
    null,
  );

  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <Button
        label="Create"
        variant="primary"
        onClick={() => {
          setDraftMortgage({
            name: '42 My St.',
          });
        }}
      />
      <Dialog
        isOpen={draftMortgage != null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDraftMortgage(null);
          }
        }}
      >
        <DialogHeader
          title="Create Mortgage"
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDraftMortgage(null);
            }
          }}
        />
        {draftMortgage != null && (
          <VStack gap={4} padding={4}>
            <form
              id="create-mortgage"
              onSubmit={(event) => {
                event.preventDefault();
                void (async () => {
                  const today = new Date();

                  setIsPending(true);
                  await insertLoan({
                    name: draftMortgage.name,
                    principal: 100000,
                    term: 30,
                    annualized_interest_rate: 0.05,
                    pre_payment: null,
                    month: today.getMonth() + 1,
                    year: today.getFullYear(),
                  });
                  setIsPending(false);
                  setDraftMortgage(null);
                })();
              }}
            >
              <VStack gap={3}>
                <TextInput
                  label="Name"
                  htmlName="name"
                  value={draftMortgage.name}
                  onChange={(name) => setDraftMortgage((p) => ({ ...p, name }))}
                />
                <FormFooter
                  isPending={isPending}
                  onCancel={() => setDraftMortgage(null)}
                />
              </VStack>
            </form>
          </VStack>
        )}
      </Dialog>
    </>
  );
}
