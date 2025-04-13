'use client';

import { Button } from '@/ds/button';
import { Form } from '@/ds/form';
import { TextField } from '@/ds/text-field';
import { resetPassword, ResetPasswordFormState } from './actions';
import { useActionState } from 'react';
import StatusMessage from '@/ds/status-message';

export default function ResetPasswordForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<
    ResetPasswordFormState,
    FormData
  >(resetPassword, {});

  return (
    <Form action={action}>
      <input type="hidden" name="next" value={next} />
      <TextField
        label="New password"
        name="password"
        type="password"
        isRequired
      />
      <Button type="submit" isPending={pending} isDisabled={pending}>
        Submit
      </Button>
      {state.errors?.form != null && (
        <StatusMessage variant="error" message={state.errors.form} />
      )}
    </Form>
  );
}
