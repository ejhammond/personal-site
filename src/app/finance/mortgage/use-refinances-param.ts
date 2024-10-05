import { WithID } from '@/utils/id';
import { Refinance } from '@/utils/loan';
import { arrayToMap, removeFromMap, setInMap } from '@/utils/map';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

export const REFINANCES_PARAM = 'refinances-v1';

const refinanceSchema = z.object({
  id: z.string(),
  principal: z.number().positive().nullable(),
  annualizedInterestRate: z.number().positive().max(1),
  years: z.number().positive(),
  month: z.number().positive(),
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
      return parsed.data;
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
