import { WithID } from '@/utils/id';
import { OneOffExtraPayment } from '@/utils/loan';
import { removeFromMap, setInMap } from '@/utils/map';
import { useCallback, useMemo, useState } from 'react';

export default function useOneOffExtraPayments(
  init: ReadonlyMap<string, WithID<OneOffExtraPayment>>,
) {
  const [oneOffExtraPaymentsMap, setOneOffExtraPayments] =
    useState<ReadonlyMap<string, WithID<OneOffExtraPayment>>>(init);

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
