'use client';

import { Fragment, useState } from 'react';
import {
  Amortizations,
  amortize,
  Loan,
  Payment,
  RecurringPayment,
  Refinance,
} from '@/utils/loan';
import { formatUSD } from '@/utils/currency';
import { plural } from '@/utils/string';
import { VStack } from '@/ds/v-stack';
import React from 'react';
import AmortizationTable from './amortization-table';
import MortgageForm from './mortgage-form';
import { formatPercent } from '@/utils/number';
import LoanStats from './loan-stats';
import { WithID } from '@/utils/id';
import { useLoan } from './loan/use-loan';
import useRefinances from './refinance/use-refinances';
import usePayments from './payment/use-payments';
import useRecurringPayments from './recurring-payment/use-recurring-payments';
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutPanel,
  PageLayoutPanelFooter,
} from '@/ds/page-layout';
import { Button } from '@/ds/button';
import { mapToArray } from '@/utils/map';
import StatusMessage from '@/ds/status-message';
import { Menu, MenuItem } from '@/ds/menu';
import { CloneLoanModal } from './loan/clone-loan-modal';
import { RenameLoanModal } from './loan/rename-loan-modal';
import { DeleteLoanModal } from './loan/delete-loan-modal';
import { CiMenuKebab } from 'react-icons/ci';

export default function Content({
  name,
  loanID,
  initialLoan,
  initialRefinances,
  initialPayments,
  initialRecurringPayments,
}: {
  name: string;
  loanID: string;
  initialLoan: Loan;
  initialRefinances: WithID<Refinance>[];
  initialPayments: WithID<Payment>[];
  initialRecurringPayments: WithID<RecurringPayment>[];
}) {
  const originalLoan = useLoan(loanID, initialLoan);
  const refinancesMap = useRefinances(loanID, initialRefinances);
  const paymentsMap = usePayments(loanID, initialPayments);
  const recurringPaymentsMap = useRecurringPayments(
    loanID,
    initialRecurringPayments,
  );

  const [amortizations, setAmortizations] = useState<{
    base: Amortizations;
    withRefinances: Amortizations;
    withRefinancesAndPrePayments: Amortizations;
  } | null>(null);

  const [error, setError] = useState<string | undefined>();

  const [isRenameFormShown, setIsRenameFormShown] = useState(false);
  const [isCloneFormShown, setIsCloneFormShown] = useState(false);
  const [isDeleteFormShown, setIsDeleteFormShown] = useState(false);

  return (
    <>
      <PageLayout
        type="full"
        header={
          <PageLayoutHeader
            title={name}
            endContent={
              <Menu
                button={
                  <Button variant="flat" aria-label="Mortgage options">
                    <CiMenuKebab />
                  </Button>
                }
              >
                <MenuItem onAction={() => setIsRenameFormShown(true)}>
                  Rename
                </MenuItem>
                <MenuItem onAction={() => setIsCloneFormShown(true)}>
                  Make a copy
                </MenuItem>
                <MenuItem onAction={() => setIsDeleteFormShown(true)}>
                  Delete
                </MenuItem>
              </Menu>
            }
          />
        }
        leftPanel={
          <PageLayoutPanel
            footer={({ close }) => (
              <PageLayoutPanelFooter>
                <VStack gap="sm" hAlign="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      const recurringPayments =
                        mapToArray(recurringPaymentsMap);
                      const payments = mapToArray(paymentsMap);
                      const refinances = mapToArray(refinancesMap);

                      try {
                        const base = amortize({ originalLoan });
                        const withRefinances = amortize({
                          originalLoan,
                          refinances: refinances.map((refinance) => ({
                            ...refinance,
                            prePayment: 0,
                          })),
                        });
                        const withRefinancesAndPrePayments = amortize({
                          originalLoan,
                          recurringPayments,
                          payments,
                          refinances,
                        });

                        setAmortizations({
                          base,
                          withRefinances,
                          withRefinancesAndPrePayments,
                        });

                        setError(undefined);
                      } catch (e: unknown) {
                        if (e instanceof Error) {
                          setError(e.message);
                        }
                      }

                      close();
                    }}
                  >
                    Calculate
                  </Button>
                  {error != null && (
                    <StatusMessage variant="error" message={error} />
                  )}
                </VStack>
              </PageLayoutPanelFooter>
            )}
          >
            {() => (
              <MortgageForm
                loanID={loanID}
                loan={originalLoan}
                refinances={refinancesMap}
                payments={paymentsMap}
                recurringPayments={recurringPaymentsMap}
              />
            )}
          </PageLayoutPanel>
        }
      >
        <VStack gap="lg">
          {amortizations == null && (
            <StatusMessage
              variant="info"
              message="Press Calculate in the left panel"
            />
          )}
          {amortizations != null && (
            <VStack gap="md">
              <h3>Statistics</h3>
              <LoanStats
                amortizationsForOriginalLoan={amortizations.base}
                amortizationsWithRefinances={amortizations.withRefinances}
                amortizationsWithRefinancesAndPrepayments={
                  amortizations.withRefinancesAndPrePayments
                }
              />
            </VStack>
          )}
          {amortizations != null &&
            amortizations.withRefinancesAndPrePayments.length > 0 && (
              <VStack gap="md" hAlign="stretch">
                {amortizations.withRefinancesAndPrePayments.map(
                  ({ loan, amortization }, index) => (
                    <Fragment key={index}>
                      <h3>
                        Loan {index + 1} - {formatUSD(loan.principal)} at{' '}
                        {formatPercent(loan.annualizedInterestRate, 3)} for{' '}
                        {loan.term} {plural('year', 'years', loan.term)}
                      </h3>
                      <AmortizationTable
                        loan={loan}
                        amortization={amortization}
                        originalLoanStart={originalLoan.start}
                      />
                    </Fragment>
                  ),
                )}
              </VStack>
            )}
        </VStack>
      </PageLayout>
      <RenameLoanModal
        isOpen={isRenameFormShown}
        onOpenChange={setIsRenameFormShown}
        loanID={loanID}
        initialName={name}
      />
      <CloneLoanModal
        isOpen={isCloneFormShown}
        onOpenChange={setIsCloneFormShown}
        templateLoan={originalLoan}
        newLoanName={`${name} (copy)`}
      />
      <DeleteLoanModal
        isOpen={isDeleteFormShown}
        onOpenChange={setIsDeleteFormShown}
        loanID={loanID}
      />
    </>
  );
}
