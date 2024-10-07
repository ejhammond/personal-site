import { MonthAndYear, monthFromNumber, monthToNumber } from '@/utils/date';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

export const STARTING_MONTH_AND_YEAR_PARAM = 'starting-month-and-year-v1';

const startingMonthAndYearSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().positive(),
});

export function serializeStartingMonthAndYear({
  month,
  year,
}: MonthAndYear): string {
  return JSON.stringify({
    month: monthToNumber(month),
    year,
  });
}

function getFromParams(params: URLSearchParams): MonthAndYear | null {
  const serialized = params.get(STARTING_MONTH_AND_YEAR_PARAM);
  if (serialized == null) {
    return null;
  }

  try {
    const data = JSON.parse(serialized);
    const parsed = startingMonthAndYearSchema.safeParse(data);

    if (parsed.success) {
      return {
        month: monthFromNumber(parsed.data.month),
        year: parsed.data.year,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export default function useOriginalLoanParam() {
  const params = useSearchParams();
  const startingMonthAndYearParam = getFromParams(params);

  const [startingMonthAndYear, setStartingMonthAndYear] =
    useState<MonthAndYear>({
      month: startingMonthAndYearParam?.month ?? 'Jan',
      year:
        startingMonthAndYearParam?.year ?? new Date(Date.now()).getFullYear(),
    });

  return {
    startingMonthAndYear,
    setStartingMonthAndYear,
  };
}
