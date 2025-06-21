import React from 'react';
import { Button } from '../button';
import { useFormContext } from './context';

function FormSubmitButton({
  isDisabled,
  isPending,
  children = 'Submit',
  variant = 'primary',
  ...delegated
}: Omit<React.ComponentProps<typeof Button>, 'type' | 'form'>) {
  const context = useFormContext();

  return (
    <Button
      {...delegated}
      type="submit"
      form={context.id}
      variant={variant}
      isDisabled={isDisabled || context.isPending}
      isPending={isPending || context.isPending}
    >
      {children}
    </Button>
  );
}

export default FormSubmitButton;
