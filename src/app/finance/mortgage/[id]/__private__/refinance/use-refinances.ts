import { createClient } from '@/supabase/client';
import { Database } from '@/types/database.types';
import { WithID } from '@/utils/id';
import { Refinance } from '@/utils/loan';
import { arrayToMap, removeFromMap, setInMap } from '@/utils/map';
import { startTransition, useCallback, useEffect, useState } from 'react';

const supabase = createClient();

type RefinanceRow = Database['public']['Tables']['mortgage_refinance']['Row'];

export default function useRefinances(
  loanID: string,
  init: WithID<Refinance>[],
): ReadonlyMap<string, WithID<Refinance>> {
  const [refinancesMap, setRefinances] = useState<
    ReadonlyMap<string, WithID<Refinance>>
  >(arrayToMap(init, ({ id }) => id));

  const upsertRefinance = useCallback((refinance: WithID<Refinance>) => {
    setRefinances((p) => setInMap(p, refinance.id, refinance));
  }, []);

  const removeRefinance = useCallback((id: string) => {
    setRefinances((p) => removeFromMap(p, id));
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('mortgage_refinance_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mortgage_refinance',
          filter: `mortgage_id=eq.${loanID}`,
        },
        (payload) => {
          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            const updated = payload.new as RefinanceRow;

            startTransition(() => {
              upsertRefinance({
                id: updated.id.toString(),
                month: updated.month,
                principal: updated.principal,
                term: updated.term,
                annualizedInterestRate: updated.annualized_interest_rate,
                prePayment: updated.pre_payment ?? 0,
              });
            });
          }

          if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: number };
            startTransition(() => {
              removeRefinance(deleted.id.toString());
            });
            return;
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loanID, removeRefinance, upsertRefinance]);

  return refinancesMap;
}
