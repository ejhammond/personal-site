import { plural } from './string';

export type Month =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';

export type MonthAndYear = { month: Month; year: number };

export const MONTHS: Month[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const monthToNumberMap = new Map<Month, number>(
  MONTHS.map((m, i) => [m, i + 1]),
);
const numberToMonthMap = new Map<number, Month>(
  MONTHS.map((m, i) => [i + 1, m]),
);

export function monthToNumber(month: Month): number {
  // assert bc we know that all months are in the map
  return monthToNumberMap.get(month)!;
}

export function monthFromNumber(number: number): Month {
  if (number < 1 || number > 12) {
    throw new Error(
      `Month number must be between 1 and 12. Received: ${number}`,
    );
  }

  // assert bc we know that 1-12 are in the map
  return numberToMonthMap.get(number)!;
}

export function monthDifference(
  startingMonthAndYear: MonthAndYear,
  endingMonthAndYear: MonthAndYear,
): number {
  const { month: startingMonth, year: startingYear } = startingMonthAndYear;
  const { month: endingMonth, year: endingYear } = endingMonthAndYear;

  const years = endingYear - startingYear;

  const monthsFromYearDiff = years * 12;

  const startingMonthNumber = monthToNumber(startingMonth);
  const endingMonthNumber = monthToNumber(endingMonth);

  const monthsFromMonthDiff = endingMonthNumber - startingMonthNumber;

  return monthsFromYearDiff + monthsFromMonthDiff;
}

export function addMonths(
  { month: startingMonth, year: startingYear }: MonthAndYear,
  months: number,
): MonthAndYear {
  const startingMonthNumber = monthToNumber(startingMonth) - 1;

  const monthsAfterStartingYear = startingMonthNumber + months;

  const years = Math.floor(monthsAfterStartingYear / 12);
  const monthsAfterEndingYear = monthsAfterStartingYear % 12;

  return {
    month: monthFromNumber(monthsAfterEndingYear + 1),
    year: startingYear + years,
  };
}

export function monthAndYearToDate({ month, year }: MonthAndYear): Date {
  return new Date(year, monthToNumber(month) - 1);
}

export function monthAndYearFromDate(date: Date): MonthAndYear {
  return {
    month: monthFromNumber(date.getMonth() + 1),
    year: date.getFullYear(),
  };
}

export function formatMonths(
  months: number,
  options?: { compact?: boolean },
): string {
  const absMonths = Math.abs(months);

  const { compact = false } = options ?? {};

  const y = Math.floor(absMonths / 12);
  const m = absMonths % 12;

  const yearsLabel = compact ? 'Y' : ` ${plural('year', 'years', y)}`;
  const monthsLabel = compact ? 'm' : ` ${plural('month', 'months', m)}`;

  return [y > 0 && `${y}${yearsLabel}`, m > 0 && `${m}${monthsLabel}`]
    .filter(Boolean)
    .join(' ');
}
