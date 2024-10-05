import { WithID } from '@/utils/id';
import { RecurringExtraPayment } from '@/utils/loan';
import { arrayToMap, removeFromMap, setInMap } from '@/utils/map';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

export const RECURRING_EXTRA_PAYMENTS_PARAM = 'recurring-extra-payments-v1';

const recurringExtraPaymentSchema = z.object({
  id: z.string(),
  startingMonth: z.number().positive(),
  amount: z.number().positive(),
});

export function serializeRecurringExtraPayments(
  recurringExtraPayments: WithID<RecurringExtraPayment>[],
): string {
  return JSON.stringify(recurringExtraPayments);
}

function getFromParams(
  params: URLSearchParams,
): WithID<RecurringExtraPayment>[] | null {
  const serialized = params.get(RECURRING_EXTRA_PAYMENTS_PARAM);
  if (serialized == null) {
    return null;
  }

  try {
    const data = JSON.parse(serialized);
    const parsed = z.array(recurringExtraPaymentSchema).safeParse(data);

    if (parsed.success) {
      return parsed.data;
    }

    return null;
  } catch {
    return null;
  }
}

export default function useRecurringExtraPaymentsParam() {
  const params = useSearchParams();
  const recurringExtraPaymentsParam = getFromParams(params);

  const [recurringExtraPaymentsMap, setRecurringExtraPayments] = useState<
    ReadonlyMap<string, WithID<RecurringExtraPayment>>
  >(arrayToMap(recurringExtraPaymentsParam ?? [], ({ id }) => id));

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
