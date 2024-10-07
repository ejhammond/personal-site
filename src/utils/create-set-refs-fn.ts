import { ForwardedRef } from 'react';

export default function createSetRefsFn<T>(...refs: ForwardedRef<T>[]) {
  return (node: T) => {
    for (const ref of refs) {
      if (ref == null) {
        return;
      }
      if (typeof ref === 'function') {
        ref(node);
        return;
      }
      ref.current = node;
    }
  };
}
