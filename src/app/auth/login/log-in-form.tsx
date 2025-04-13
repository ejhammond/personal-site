'use client';

import { Button } from '@/ds/button';
import { Form } from '@/ds/form';
import StatusMessage from '@/ds/status-message';
import { TextField } from '@/ds/text-field';
import { useActionState } from 'react';
import { logIn, LogInFormState } from './actions';

export default function LogInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LogInFormState, FormData>(
    logIn,
    {},
  );

  return (
    <Form action={action}>
      <input type="hidden" name="next" value={next} />
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
        Log in
      </Button>
      {state.errors?.form != null && (
        <StatusMessage variant="error" message={state.errors.form} />
      )}
    </Form>
  );
}
