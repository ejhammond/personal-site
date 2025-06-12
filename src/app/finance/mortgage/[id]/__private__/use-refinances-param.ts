import { WithID } from '@/utils/id';
import { Refinance } from '@/utils/loan';
import { removeFromMap, setInMap } from '@/utils/map';
import { useCallback, useMemo, useState } from 'react';

export default function useRefinances(
  init: ReadonlyMap<string, WithID<Refinance>>,
) {
  const [refinancesMap, setRefinances] =
    useState<ReadonlyMap<string, WithID<Refinance>>>(init);

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
