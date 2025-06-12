import { WithID } from '@/utils/id';
import { RecurringExtraPayment } from '@/utils/loan';
import { removeFromMap, setInMap } from '@/utils/map';
import { useCallback, useMemo, useState } from 'react';

export default function useRecurringExtraPayments(
  init: ReadonlyMap<string, WithID<RecurringExtraPayment>>,
) {
  const [recurringExtraPaymentsMap, setRecurringExtraPayments] =
    useState<ReadonlyMap<string, WithID<RecurringExtraPayment>>>(init);

  const addRecurringExtraPayment = useCallback(
    (recurringExtraPayment: WithID<RecurringExtraPayment>) => {
      setRecurringExtraPayments((p) =>
        setInMap(p, recurringExtraPayment.id, recurringExtraPayment),
      );
    },
    [],
  );

  const removeRecurringExtraPayment = useCallback((id: string) => {
    setRecurringExtraPayments((p) => removeFromMap(p, id));
  }, []);

  const recurringExtraPayments = useMemo(
    () => Array.from(recurringExtraPaymentsMap.values()),
    [recurringExtraPaymentsMap],
  );

  return {
    recurringExtraPayments,
    addRecurringExtraPayment,
    removeRecurringExtraPayment,
  };
}
