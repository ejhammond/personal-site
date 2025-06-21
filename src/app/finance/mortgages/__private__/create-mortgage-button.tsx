'use client';

import { Button } from '@/ds/button';
import { Dialog } from '@/ds/dialog';
import { Form } from '@/ds/form';
import { FormEventContextProvider } from '@/ds/form/event-context';
import FormFooter from '@/ds/form/footer';
import { Modal } from '@/ds/modal';
import { TextField } from '@/ds/text-field';
import { VStack } from '@/ds/v-stack';
import { useState } from 'react';
import { Heading } from 'react-aria-components';
import { insertLoan } from '../[id]/__private__/loan/loan-actions';

export function CreateMortgageButton() {
  const [draftMortgage, setDraftMortgage] = useState<{ name: string } | null>(
    null,
  );

  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setDraftMortgage({
            name: '42 My St.',
          });
        }}
      >
        Create
      </Button>
      {draftMortgage != null && (
        <Modal
          isDismissable
          isOpen={draftMortgage != null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDraftMortgage(null);
            }
          }}
        >
          <Dialog>
            {({ close }) => (
              <VStack gap="md">
                <Heading slot="title">Create Mortgage</Heading>
                <FormEventContextProvider onCancel={close}>
                  <Form
                    id="create-mortgage"
                    isPending={isPending}
                    action={async () => {
                      const today = new Date();

                      setIsPending(true);
                      const state = await insertLoan({
                        name: draftMortgage.name,
                        principal: 100000,
                        term: 30,
                        annualized_interest_rate: 0.05,
                        pre_payment: null,
                        month: today.getMonth() + 1,
                        year: today.getFullYear(),
                      });
                      console.log(state);
                      setIsPending(false);
                      close();
                    }}
                    footer={<FormFooter />}
                  >
                    <TextField
                      label="Name"
                      name="name"
                      value={draftMortgage.name}
                      onChange={(name) =>
                        setDraftMortgage((p) => ({ ...p, name }))
                      }
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
