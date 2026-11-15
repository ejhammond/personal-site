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
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { Icon } from '@astryxdesign/core/Icon';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
} from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { MoreMenu } from '@astryxdesign/core/MoreMenu';
import { Section } from '@astryxdesign/core/Section';
import { HStack, StackItem, VStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Text';
import { mapToArray } from '@/utils/map';
import { CloneLoanModal } from './loan/clone-loan-modal';
import { RenameLoanModal } from './loan/rename-loan-modal';
import { DeleteLoanModal } from './loan/delete-loan-modal';

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

  const isNarrow = useMediaQuery('(max-width: 1024px)');
  const [isPanelShown, setIsPanelShown] = useState(true);
  const [isPanelDialogOpen, setIsPanelDialogOpen] = useState(false);

  const togglePanel = () => {
    if (isNarrow) {
      setIsPanelDialogOpen(true);
    } else {
      setIsPanelShown((isShown) => !isShown);
    }
  };

  const calculate = () => {
    const recurringPayments = mapToArray(recurringPaymentsMap);
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

    if (isNarrow) {
      setIsPanelDialogOpen(false);
    } else {
      setIsPanelShown(false);
    }
  };

  const panel = (
    <VStack gap={4}>
      <MortgageForm
        loanID={loanID}
        loan={originalLoan}
        refinances={refinancesMap}
        payments={paymentsMap}
        recurringPayments={recurringPaymentsMap}
      />
      <VStack gap={2} hAlign="end">
        <Button label="Calculate" variant="primary" onClick={calculate} />
      </VStack>
      {error != null && <Banner status="error" title={error} />}
    </VStack>
  );

  return (
    <>
      <Layout
        height="fill"
        contentWidth={1000}
        defaultHasDividers
        header={
          <LayoutHeader hasDivider padding={4} paddingBlockEnd={0}>
            <VStack gap={3}>
              <HStack gap={4} vAlign="start">
                <StackItem size="fill">
                  <VStack gap={0}>
                    <Link href="/finance/mortgages" color="secondary">
                      <HStack gap={1} vAlign="center">
                        <Icon icon="chevronLeft" size="sm" color="inherit" />
                        All mortgages
                      </HStack>
                    </Link>
                    <Heading level={1} maxLines={1}>
                      {name}
                    </Heading>
                  </VStack>
                </StackItem>
                <HStack gap={2}>
                  <Button
                    label={
                      isNarrow || !isPanelShown ? 'Show panel' : 'Hide panel'
                    }
                    variant="ghost"
                    size="md"
                    icon={<Icon icon="viewColumns" size="sm" />}
                    isIconOnly
                    onClick={togglePanel}
                  />
                  <MoreMenu
                    label="Mortgage options"
                    alignment="end"
                    items={[
                      {
                        label: 'Rename',
                        onClick: () => setIsRenameFormShown(true),
                      },
                      {
                        label: 'Make a copy',
                        onClick: () => setIsCloneFormShown(true),
                      },
                      {
                        label: 'Delete',
                        onClick: () => setIsDeleteFormShown(true),
                        variant: 'destructive',
                      },
                    ]}
                  />
                </HStack>
              </HStack>
            </VStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent role="main">
            <VStack gap={4}>
              {amortizations == null && (
                <Banner status="info" title="Press Calculate in the panel" />
              )}
              {amortizations != null && (
                <Section>
                  <VStack gap={4}>
                    <Heading level={2}>Statistics</Heading>
                    <LoanStats
                      amortizationsForOriginalLoan={amortizations.base}
                      amortizationsWithRefinances={amortizations.withRefinances}
                      amortizationsWithRefinancesAndPrepayments={
                        amortizations.withRefinancesAndPrePayments
                      }
                    />
                  </VStack>
                </Section>
              )}
              {amortizations != null &&
                amortizations.withRefinancesAndPrePayments.length > 0 && (
                  <VStack gap={4}>
                    {amortizations.withRefinancesAndPrePayments.map(
                      ({ loan, amortization }, index) => (
                        <Section key={index}>
                          <VStack gap={4}>
                            <Heading level={2}>
                              Loan {index + 1} - {formatUSD(loan.principal)} at{' '}
                              {formatPercent(loan.annualizedInterestRate, 3)}{' '}
                              for {loan.term}{' '}
                              {plural('year', 'years', loan.term)}
                            </Heading>
                            <AmortizationTable
                              loan={loan}
                              amortization={amortization}
                              originalLoanStart={originalLoan.start}
                            />
                          </VStack>
                        </Section>
                      ),
                    )}
                  </VStack>
                )}
            </VStack>
          </LayoutContent>
        }
        end={
          !isNarrow && isPanelShown ? (
            <LayoutPanel width={320} padding={4} role="complementary">
              {panel}
            </LayoutPanel>
          ) : undefined
        }
      />
      <Dialog
        variant="fullscreen"
        isOpen={isNarrow && isPanelDialogOpen}
        onOpenChange={setIsPanelDialogOpen}
      >
        <Layout
          header={
            <DialogHeader
              title="Mortgage"
              onOpenChange={setIsPanelDialogOpen}
            />
          }
          content={<LayoutContent padding={4}>{panel}</LayoutContent>}
        />
      </Dialog>
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
