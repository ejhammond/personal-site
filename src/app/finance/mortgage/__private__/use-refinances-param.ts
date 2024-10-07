import { createUniqueID, WithID } from '@/utils/id';
import { Refinance } from '@/utils/loan';
import { arrayToMap, removeFromMap, setInMap } from '@/utils/map';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

export const REFINANCES_PARAM = 'refinances-v1';

const refinanceSchema = z.object({
  // required
  month: z.number().positive(),
  years: z.number().positive(),
  annualizedInterestRate: z.number().min(0).max(1),
  // optional
  id: z.string().optional(),
  principal: z.number().min(0).optional().nullable(),
  prePayment: z.number().min(0).optional(),
});

export function serializeRefinances(refinances: WithID<Refinance>[]): string {
  return JSON.stringify(refinances);
}

function getFromParams(params: URLSearchParams): WithID<Refinance>[] | null {
  const serialized = params.get(REFINANCES_PARAM);
  if (serialized == null) {
    return null;
  }

  try {
    const data = JSON.parse(serialized);
    const parsed = z.array(refinanceSchema).safeParse(data);

    if (parsed.success) {
      return parsed.data.map(
        ({
          id,
          years,
          month,
          principal,
          prePayment,
          annualizedInterestRate,
        }) => ({
          month,
          annualizedInterestRate,
          years,
          // optional in param
          id: id ?? createUniqueID(),
          principal: principal ?? null,
          prePayment: prePayment ?? 0,
        }),
      );
    }

    return null;
  } catch {
    return null;
  }
}

export default function useRefinancesParam() {
  const params = useSearchParams();
  const refinancesParam = getFromParams(params);

  const [refinancesMap, setRefinances] = useState<
    ReadonlyMap<string, WithID<Refinance>>
  >(arrayToMap(refinancesParam ?? [], ({ id }) => id));

  const addRefinance = useCallback((refinance: WithID<Refinance>) => {
    setRefinances((p) => setInMap(p, refinance.id, refinance));
  }, []);

  const removeRefinance = useCallback((id: string) => {
    setRefinances((p) => removeFromMap(p, id));
  }, []);

  const refinances = useMemo(
    () => Array.from(refinancesMap.values()),
    [refinancesMap],
  );

  return {
    refinances,
    addRefinance,
    removeRefinance,
  };
}
