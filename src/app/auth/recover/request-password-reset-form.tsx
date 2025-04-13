'use client';

import { Button } from '@/ds/button';
import { TextField } from '@/ds/text-field';
import { requestPasswordReset, RequestPasswordResetFormState } from './actions';
import { useActionState } from 'react';
import { Form } from '@/ds/form';
import StatusMessage from '@/ds/status-message';

export default function RequestPasswordResetForm({
  next,
}: {
  next: string | null;
}) {
  const [state, action, pending] = useActionState<
    RequestPasswordResetFormState,
    FormData
  >(requestPasswordReset, { type: null });

  return (
    <Form action={action}>
      {next != null && <input type="hidden" name="next" value={next} />}
      <TextField
        label="Email"
        name="email"
        type="email"
        isRequired
        errorMessage={state.type === 'error' ? state.errors.email : undefined}
      />
      <Button type="submit" isPending={pending} isDisabled={pending}>
        Request reset link
      </Button>
      {state.type === 'error' && state.errors.form != null && (
        <StatusMessage variant="error" message={state.errors.form} />
      )}
      {state.type === 'success' && (
        <StatusMessage
          variant="info"
          message="Check your email for a rest link!"
        />
      )}
    </Form>
  );
}
