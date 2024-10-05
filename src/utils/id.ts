export type WithID<T> = T & {
  id: string;
};

export function createUniqueID(): string {
  return (Math.random() * 100000000).toFixed(0);
}
