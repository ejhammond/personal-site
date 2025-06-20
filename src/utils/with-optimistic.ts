export type WithOptimistic<T> = T & {
  /**
   * Whether the item is in an optimistic state.
   * @default false
   */
  isPending?: boolean;
  /**
   * Whether an optimistic update has failed.
   * @default false
   */
  hasError?: boolean;
};

export function optimisticPending<T>(item: T): WithOptimistic<T> {
  return {
    ...item,
    isPending: true,
  };
}

export function optimisticError<T>(item: T): WithOptimistic<T> {
  return {
    ...item,
    isPending: false,
    hasError: true,
  };
}
