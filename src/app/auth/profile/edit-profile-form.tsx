'use client';

import { Button } from '@/ds/button';
import { Form } from '@/ds/form';
import { TextField } from '@/ds/text-field';
import { updateUser, UpdateUserFormState } from './actions';
import StatusMessage from '@/ds/status-message';
import { useActionState } from 'react';

export default function EditProfileForm({
  initialDisplayName,
  initialEmail,
}: {
  initialDisplayName: string;
  initialEmail: string | undefined;
}) {
  const [state, action, pending] = useActionState<
    UpdateUserFormState,
    FormData
  >(updateUser, { type: null });

  return (
    <Form action={action}>
      <TextField
        label="Display name"
        name="display-name"
        type="text"
        defaultValue={initialDisplayName}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        defaultValue={initialEmail}
      />
      <TextField label="New password" name="password" type="password" />
      <Button type="submit" isPending={pending} isDisabled={pending}>
        Save
      </Button>
      {state.type === 'error' && state.errors.form != null && (
        <StatusMessage variant="error" message={state.errors.form} />
      )}
      {state.type === 'success' && (
        <StatusMessage variant="info" message="Updated account info!" />
      )}
    </Form>
  );
}
