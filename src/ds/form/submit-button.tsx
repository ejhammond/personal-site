import React from 'react';
import { Button } from '../button';
import { useFormContext } from './context';

function FormSubmitButton({
  isDisabled,
  isPending,
  children = 'Submit',
  ...delegated
}: Omit<React.ComponentProps<typeof Button>, 'type' | 'variant' | 'form'>) {
  const context = useFormContext();

  return (
    <Button
      {...delegated}
      type="submit"
      variant="primary"
      form={context.id}
      isDisabled={isDisabled || context.isPending}
      isPending={isPending || context.isPending}
    >
      {children}
    </Button>
  );
}

export default FormSubmitButton;
