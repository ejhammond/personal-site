import { createContext, useContext } from 'react';

type FormContextValue = Readonly<{
  id: string;
  isPending: boolean;
}>;

/**
 * Internal context for providing state to internal form components.
 */
export const FormContext = createContext<FormContextValue | undefined>(
  undefined,
);

export function useFormContext(): FormContextValue {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormContextProvider');
  }
  return context;
}
