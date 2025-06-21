'use client';

import { Form } from '@/ds/form';
import { TextField } from '@/ds/text-field';
import { useActionState, useMemo } from 'react';
import { logIn, LogInFormState } from './actions';
import FormFooter from '@/ds/form/footer';
import FormSubmitButton from '@/ds/form/submit-button';

export default function LogInForm({ next }: { next: string }) {
  const [actionState, action, isPending] = useActionState<
    LogInFormState,
    FormData
  >(logIn, {});

  const hiddenValues = useMemo(() => new Map([['next', next]]), [next]);

  return (
    <Form
      id="log-in"
      action={action}
      isPending={isPending}
      hiddenValues={hiddenValues}
      footer={
        <FormFooter
          errorMessage={actionState.errors?.form}
          submitButton={<FormSubmitButton>Log in</FormSubmitButton>}
        />
      }
      validationErrors={actionState.errors}
    >
      <TextField label="Email" name="email" type="email" isRequired />
      <TextField label="Password" name="password" type="password" isRequired />
    </Form>
  );
}
