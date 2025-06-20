import { createClient } from '@/supabase/client';
import { Database } from '@/types/database.types';
import { WithID } from '@/utils/id';
import { RecurringPayment } from '@/utils/loan';
import { arrayToMap, removeFromMap, setInMap } from '@/utils/map';
import { startTransition, useCallback, useEffect, useState } from 'react';

const supabase = createClient();

type RecurringPaymentRow =
  Database['public']['Tables']['mortgage_recurring_payment']['Row'];

export default function useRecurringPayments(
  loanID: string,
  init: WithID<RecurringPayment>[],
): ReadonlyMap<string, WithID<RecurringPayment>> {
  const [recurringPaymentsMap, setRecurringPayments] = useState<
    ReadonlyMap<string, WithID<RecurringPayment>>
  >(arrayToMap(init, ({ id }) => id));

  const upsertRecurringPayment = useCallback(
    (recurringPayment: WithID<RecurringPayment>) => {
      setRecurringPayments((p) =>
        setInMap(p, recurringPayment.id, recurringPayment),
      );
    },
    [],
  );

  const removeRecurringPayment = useCallback((id: string) => {
    setRecurringPayments((p) => removeFromMap(p, id));
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('mortgage_recurring_payment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mortgage_recurring_payment',
          filter: `mortgage_id=eq.${loanID}`,
        },
        (payload) => {
          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            const updated = payload.new as RecurringPaymentRow;

            startTransition(() => {
              upsertRecurringPayment({
                id: updated.id.toString(),
                startingMonth: updated.starting_month,
                amount: updated.amount,
              });
            });
          }

          if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: number };
            startTransition(() => {
              removeRecurringPayment(deleted.id.toString());
            });
            return;
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loanID, removeRecurringPayment, upsertRecurringPayment]);

  return recurringPaymentsMap;
}
