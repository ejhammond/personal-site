'use client';

import { Button } from '@/ds/button';
import { Form } from '@/ds/form';
import StatusMessage from '@/ds/status-message';
import { TextField } from '@/ds/text-field';
import { signUp, SignUpFormState } from './actions';
import { useActionState } from 'react';

export default function SignUpForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignUpFormState, FormData>(
    signUp,
    {},
  );

  return (
    <Form id="sign-up" action={action} validationErrors={state.errors}>
      <input type="hidden" name="next" value={next} />
      <TextField
        label="Display name"
        name="displayName"
        type="text"
        isRequired
      />
      <TextField label="Email" name="email" type="email" isRequired />
      <TextField label="Password" name="password" type="password" isRequired />
      <Button type="submit" isPending={pending} isDisabled={pending}>
        Sign up
      </Button>
      {state.errors?.form != null && (
        <StatusMessage variant="error" message={state.errors.form} />
      )}
    </Form>
  );
}
