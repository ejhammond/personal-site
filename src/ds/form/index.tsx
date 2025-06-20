import { Form as AriaForm, FormProps } from 'react-aria-components';
import './index.css';
import { FormEvent, useContext, useMemo } from 'react';
import { FormEventContext } from './event-context';
import { FormContext } from './context';

export function Form({
  children,
  footer,
  id,
  isPending = false,
  onSubmit,
  ...delegatedProps
}: FormProps & {
  footer?: React.ReactNode;
  id: string;
  isPending?: boolean;
}) {
  const eventContext = useContext(FormEventContext);

  const contextValue = useMemo(
    () => ({
      id,
      isPending,
    }),
    [id, isPending],
  );

  return (
    <AriaForm
      id={id}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        onSubmit?.(event);
        eventContext?.onSubmit?.();
      }}
      {...delegatedProps}
    >
      <FormContext.Provider value={contextValue}>
        <div className="fields">{children}</div>
        {footer != null && <div className="footer">{footer}</div>}
      </FormContext.Provider>
    </AriaForm>
  );
}
