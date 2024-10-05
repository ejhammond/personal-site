export type WithID<T> = T & {
  id: string;
};

export function createUniqueID(): string {
  return (Math.random() * 100000000).toFixed(0);
}

export function idify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}
