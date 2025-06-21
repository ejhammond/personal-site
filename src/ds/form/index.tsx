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
  hiddenValues,
  ...delegatedProps
}: FormProps & {
  footer?: React.ReactNode;
  id: string;
  isPending?: boolean;
  hiddenValues?: ReadonlyMap<string, string>;
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
        {hiddenValues != null &&
          Array.from(hiddenValues.entries()).map(([name, value]) => (
            <input type="hidden" key={name} name={name} value={value} />
          ))}
        <div className="fields">{children}</div>
        {footer != null && <footer>{footer}</footer>}
      </FormContext.Provider>
    </AriaForm>
  );
}
