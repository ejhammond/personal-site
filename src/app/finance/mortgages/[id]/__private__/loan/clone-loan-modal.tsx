'use client';

import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {VStack} from '@astryxdesign/core/Stack';
import {useState} from 'react';
import {cloneLoan, CloneLoanActionState} from './loan-actions';
import {FormFooter} from '@/components/form-footer';
import {Loan} from '@/utils/loan';
import {monthToNumber} from '@/utils/date';

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
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader title="Copy mortgage?" onOpenChange={onOpenChange} />
      <VStack gap={4} padding={4}>
        <form
          id="clone"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
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
            })();
          }}
        >
          <VStack gap={3}>
            <FormFooter
              isPending={isPending}
              submitLabel="Make a copy"
              errorMessage={actionState.errors?.form}
              onCancel={() => onOpenChange(false)}
            />
          </VStack>
        </form>
      </VStack>
    </Dialog>
  );
}
