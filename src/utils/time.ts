import { formatList } from './string';

export function printDurationFromMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainder = months % 12;

  return formatList(
    [
      years > 0 && `${years} years`,
      remainder > 0 && `${remainder} months`,
    ].filter(Boolean) as string[],
  );
}
