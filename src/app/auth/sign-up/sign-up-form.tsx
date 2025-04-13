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
    <Form action={action}>
      <input type="hidden" name="next" value={next} />
      <TextField
        label="Display name"
        name="display-name"
        type="text"
        isRequired
        errorMessage={state.errors?.displayName}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        isRequired
        errorMessage={state.errors?.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        isRequired
        errorMessage={state.errors?.password}
      />
      <Button type="submit" isPending={pending} isDisabled={pending}>
        Sign up
      </Button>
      {state.errors?.form != null && (
        <StatusMessage variant="error" message={state.errors.form} />
      )}
    </Form>
  );
}
