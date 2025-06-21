'use client';

import { Dialog } from '@/ds/dialog';
import { Form } from '@/ds/form';
import { FormEventContextProvider } from '@/ds/form/event-context';
import { Modal } from '@/ds/modal';
import { VStack } from '@/ds/v-stack';
import { useState } from 'react';
import { Heading } from 'react-aria-components';
import { cloneLoan, CloneLoanActionState } from './loan-actions';
import FormFooter from '@/ds/form/footer';
import FormSubmitButton from '@/ds/form/submit-button';
import { Loan } from '@/utils/loan';
import { monthToNumber } from '@/utils/date';

export function CloneLoanModal({
  isOpen,
  onOpenChange,
  templateLoan,
  newLoanName,
}: Readonly<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newLoanName: string;
  templateLoan: Loan;
}>) {
  const [actionState, setActionState] = useState<CloneLoanActionState>({});
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <Modal isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <VStack gap="md">
            <Heading slot="title">Copy mortgage?</Heading>
            <FormEventContextProvider onCancel={close}>
              <Form
                id="clone"
                isPending={isPending}
                action={async () => {
                  setIsPending(true);
                  setActionState({});
                  const state = await cloneLoan({
                    name: newLoanName,
                    month: monthToNumber(templateLoan.start.month),
                    year: templateLoan.start.year,
                    principal: templateLoan.principal,
                    annualized_interest_rate:
                      templateLoan.annualizedInterestRate,
                    term: templateLoan.term,
                    pre_payment: templateLoan.prePayment,
                  });
                  setActionState(state);
                  setIsPending(false);
                }}
                footer={
                  <FormFooter
                    errorMessage={actionState.errors?.form}
                    submitButton={
                      <FormSubmitButton>Make a copy</FormSubmitButton>
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
