import { createClient } from '@/supabase/client';
import { Database } from '@/types/database.types';
import { WithID } from '@/utils/id';
import { Payment } from '@/utils/loan';
import { arrayToMap, removeFromMap, setInMap } from '@/utils/map';
import { startTransition, useCallback, useEffect, useState } from 'react';

const supabase = createClient();

type PaymentRow = Database['public']['Tables']['mortgage_payment']['Row'];

export default function usePayments(
  loanID: string,
  init: WithID<Payment>[],
): ReadonlyMap<string, WithID<Payment>> {
  const [paymentsMap, setPayments] = useState<
    ReadonlyMap<string, WithID<Payment>>
  >(arrayToMap(init, ({ id }) => id));

  const upsertPayment = useCallback((payment: WithID<Payment>) => {
    setPayments((p) => setInMap(p, payment.id, payment));
  }, []);

  const removePayment = useCallback((id: string) => {
    setPayments((p) => removeFromMap(p, id));
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('mortgage_payment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mortgage_payment',
          filter: `mortgage_id=eq.${loanID}`,
        },
        (payload) => {
          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            const updated = payload.new as PaymentRow;

            startTransition(() => {
              upsertPayment({
                id: updated.id.toString(),
                month: updated.month,
                amount: updated.amount,
              });
            });
          }

          if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: number };
            startTransition(() => {
              removePayment(deleted.id.toString());
            });
            return;
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loanID, removePayment, upsertPayment]);

  return paymentsMap;
}
