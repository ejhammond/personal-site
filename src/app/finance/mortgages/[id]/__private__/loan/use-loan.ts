import { createClient } from '@/supabase/client';
import { Database } from '@/types/database.types';
import { monthFromNumber } from '@/utils/date';
import { parseDBID } from '@/utils/id';
import { Loan } from '@/utils/loan';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';

const supabase = createClient();

export function useLoan(id: string, init: Loan): Loan {
  const [loan, setLoan] = useState<Loan>(init);
  const router = useRouter();

  useEffect(() => {
    // Route params are raw strings; a non-numeric id would make the
    // realtime filter malformed, so don't subscribe at all.
    const numericId = parseDBID(id);
    if (numericId == null) {
      return;
    }

    const channel = supabase
      .channel('mortgage_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mortgage',
          filter: `id=eq.${numericId}`,
        },
        (payload) => {
          const updatedLoan =
            payload.new as Database['public']['Tables']['mortgage']['Row'];

          startTransition(() => {
            setLoan({
              start: {
                month: monthFromNumber(updatedLoan.month),
                year: updatedLoan.year,
              },
              principal: updatedLoan.principal,
              annualizedInterestRate: updatedLoan.annualized_interest_rate,
              term: updatedLoan.term,
              prePayment: updatedLoan.pre_payment ?? 0,
            });
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'mortgage',
          filter: `id=eq.${numericId}`,
        },
        () => {
          // Deleted in another tab: this page no longer has a loan to show.
          router.push('/finance/mortgages');
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, router]);

  return loan;
}
