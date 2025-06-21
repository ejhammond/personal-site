'use client';

import { TextField } from '@/ds/text-field';
import { requestPasswordReset, RequestPasswordResetFormState } from './actions';
import { useActionState, useMemo } from 'react';
import { Form } from '@/ds/form';
import FormFooter from '@/ds/form/footer';
import FormSubmitButton from '@/ds/form/submit-button';

export default function RequestPasswordResetForm({
  next,
}: {
  next?: string | null;
}) {
  const [actionState, action, isPending] = useActionState<
    RequestPasswordResetFormState,
    FormData
  >(requestPasswordReset, { type: null });

  const hiddenValues = useMemo(() => {
    const values = new Map();

    if (next != null) {
      values.set('next', next);
    }

    return values;
  }, [next]);

  return (
    <Form
      id="reset-password"
      isPending={isPending}
      action={action}
      hiddenValues={hiddenValues}
      validationErrors={actionState.type === 'error' ? actionState.errors : {}}
      footer={
        <FormFooter
          errorMessage={
            actionState.type === 'error' ? actionState.errors.form : undefined
          }
          successMessage={
            actionState.type === 'success'
              ? 'Check your email for a reset link!'
              : undefined
          }
          submitButton={<FormSubmitButton>Request reset link</FormSubmitButton>}
        />
      }
    >
      <TextField label="Email" name="email" type="email" isRequired />
    </Form>
  );
}
