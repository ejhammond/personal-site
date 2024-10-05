import { WithID } from '@/utils/id';
import { OneOffExtraPayment } from '@/utils/loan';
import { arrayToMap, removeFromMap, setInMap } from '@/utils/map';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

export const ONE_OFF_EXTRA_PAYMENTS_PARAM = 'one-off-extra-payments-v1';

const oneOffExtraPaymentSchema = z.object({
  id: z.string(),
  month: z.number().positive(),
  amount: z.number().positive(),
});

export function serializeOneOffExtraPayments(
  oneOffExtraPayments: WithID<OneOffExtraPayment>[],
): string {
  return JSON.stringify(oneOffExtraPayments);
}

function getFromParams(
  params: URLSearchParams,
): WithID<OneOffExtraPayment>[] | null {
  const serialized = params.get(ONE_OFF_EXTRA_PAYMENTS_PARAM);
  if (serialized == null) {
    return null;
  }

  try {
    const data = JSON.parse(serialized);
    const parsed = z.array(oneOffExtraPaymentSchema).safeParse(data);

    if (parsed.success) {
      return parsed.data;
    }

    return null;
  } catch {
    return null;
  }
}

export default function useOneOffExtraPaymentsParam() {
  const params = useSearchParams();
  const oneOffExtraPaymentsParam = getFromParams(params);

  const [oneOffExtraPaymentsMap, setOneOffExtraPayments] = useState<
    ReadonlyMap<string, WithID<OneOffExtraPayment>>
  >(arrayToMap(oneOffExtraPaymentsParam ?? [], ({ id }) => id));

  const addOneOffExtraPayment = useCallback(
    (oneOffExtraPayment: WithID<OneOffExtraPayment>) => {
      setOneOffExtraPayments((p) =>
        setInMap(p, oneOffExtraPayment.id, oneOffExtraPayment),
      );
    },
    [],
  );

  const removeOneOffExtraPayment = useCallback((id: string) => {
    setOneOffExtraPayments((p) => removeFromMap(p, id));
  }, []);

  const oneOffExtraPayments = useMemo(
    () => Array.from(oneOffExtraPaymentsMap.values()),
    [oneOffExtraPaymentsMap],
  );

  return {
    oneOffExtraPayments,
    addOneOffExtraPayment,
    removeOneOffExtraPayment,
  };
}
