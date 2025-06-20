import { createContext, useContext, useMemo } from 'react';

type FormEventContextValue = Readonly<{
  onSubmit: () => void;
  onCancel: () => void;
}>;

/**
 * Context for adding extra onSubmit/onCancel handlers to a form.
 */
export const FormEventContext = createContext<
  FormEventContextValue | undefined
>(undefined);

export function FormEventContextProvider({
  children,
  onSubmit,
  onCancel,
}: {
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
}) {
  const inheritedContext = useContext(FormEventContext);

  const contextValue = useMemo(
    () => ({
      onCancel: () => {
        inheritedContext?.onCancel?.();
        onCancel?.();
      },
      onSubmit: () => {
        inheritedContext?.onSubmit?.();
        onSubmit?.();
      },
    }),
    [inheritedContext, onSubmit, onCancel],
  );

  return (
    <FormEventContext.Provider value={contextValue}>
      {children}
    </FormEventContext.Provider>
  );
}
