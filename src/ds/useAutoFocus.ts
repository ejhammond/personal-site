import { MutableRefObject, useEffect, useRef } from 'react';

/**
 * Focuses and selects the current text of an input. This is necessary because
 * the `autofocus` HTML attribute does not highlight the text and sometimes
 * places the cursor at the start of the field rather than the end.
 */
export default function useAutoFocusRef(): MutableRefObject<HTMLInputElement | null> {
  const elRef = useRef<HTMLInputElement>(null);
  const didAutoFocusRef = useRef<boolean>(false);

  useEffect(() => {
    if (elRef.current != null && !didAutoFocusRef.current) {
      // using optional calls in case the el is not actually an input el
      elRef.current.focus?.();
      elRef.current.select?.();

      didAutoFocusRef.current = true;
    }
  });

  return elRef;
}
