import { MonthAndYear } from '@/utils/date';
import { useState } from 'react';

export default function useStartingMonthAndYear(init: MonthAndYear) {
  const [startingMonthAndYear, setStartingMonthAndYear] =
    useState<MonthAndYear>(init);

  return {
    startingMonthAndYear,
    setStartingMonthAndYear,
  };
}
