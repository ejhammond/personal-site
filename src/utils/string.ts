export function capitalizeWord(w: string) {
  return `${w.slice(0, 1).toUpperCase()}${w.slice(1)}`;
}

export function makeHeading(str: string): string {
  return str.split('-').map(capitalizeWord).join(' ');
}

export function formatList(
  list: Iterable<string>,
  conjunction: 'and' | 'but' | 'or' | 'nor' = 'and',
): string {
  const arr = Array.from(list);
  if (arr.length === 1) {
    return arr[0];
  }

  const allButLast = arr.slice(0, -1);
  const last = arr.slice(-1)[0];

  return `${allButLast.join(', ')} ${conjunction} ${last}`;
}

export function plural(
  singular: string,
  plural: string,
  count: number,
): string {
  return count === 1 ? singular : plural;
}
