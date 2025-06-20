'use client';

import { Form } from '@/ds/form';
import { TextField } from '@/ds/text-field';
import { updateUser, UpdateUserFormState } from './actions';
import { useActionState } from 'react';
import FormFooter from '@/ds/form/footer';

export default function EditProfileForm({
  initialDisplayName,
  initialEmail,
}: {
  initialDisplayName: string;
  initialEmail: string | undefined;
}) {
  const [actionState, action, isPending] = useActionState<
    UpdateUserFormState,
    FormData
  >(updateUser, { type: null });

  return (
    <Form
      id="edit-profile"
      action={action}
      isPending={isPending}
      footer={
        <FormFooter
          successMessage={
            actionState.type === 'success' ? 'Updated account info!' : undefined
          }
          errorMessage={
            actionState.type === 'error' ? actionState.errors.form : undefined
          }
        />
      }
    >
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
    </Form>
  );
}
