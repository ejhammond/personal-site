'use client';

import { Form } from '@/ds/form';
import { TextField } from '@/ds/text-field';
import { useActionState } from 'react';
import { logIn, LogInFormState } from './actions';
import FormFooter from '@/ds/form/footer';
import FormSubmitButton from '@/ds/form/submit-button';

export default function LogInForm({ next }: { next: string }) {
  const [actionState, action, isPending] = useActionState<
    LogInFormState,
    FormData
  >(logIn, {});

  return (
    <Form
      id="log-in"
      action={action}
      isPending={isPending}
      footer={
        <FormFooter
          errorMessage={actionState.errors?.form}
          submitButton={<FormSubmitButton>Log in</FormSubmitButton>}
        />
      }
      validationErrors={actionState.errors}
    >
      <input type="hidden" name="next" value={next} />
      <TextField label="Email" name="email" type="email" isRequired />
      <TextField label="Password" name="password" type="password" isRequired />
    </Form>
  );
}
