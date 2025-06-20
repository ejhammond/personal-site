import { createClient } from '@/supabase/client';
import { Database } from '@/types/database.types';
import { monthFromNumber } from '@/utils/date';
import { Loan } from '@/utils/loan';
import { startTransition, useEffect, useState } from 'react';

const supabase = createClient();

export function useLoan(id: string, init: Loan): Loan {
  const [loan, setLoan] = useState<Loan>(init);

  useEffect(() => {
    const channel = supabase
      .channel('mortgage_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mortgage',
          filter: `id=eq.${id}`,
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return loan;
}
