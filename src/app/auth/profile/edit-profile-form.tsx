'use client';

import { useActionState, useState } from 'react';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { VStack } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { updateUser, UpdateUserFormState } from './actions';

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
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [email, setEmail] = useState(initialEmail ?? '');
  const [password, setPassword] = useState('');

  return (
    <form id="edit-profile" action={action}>
      <VStack gap={4}>
        {actionState.type === 'success' && (
          <Banner
            status="success"
            title="Updated account info!"
            container="card"
          />
        )}
        {actionState.type === 'error' && actionState.errors.form != null && (
          <Banner
            status="error"
            title={actionState.errors.form}
            container="card"
          />
        )}
        <TextInput
          label="Display name"
          htmlName="display-name"
          type="text"
          value={displayName}
          onChange={setDisplayName}
          isDisabled={isPending}
        />
        <TextInput
          label="Email"
          htmlName="email"
          type="email"
          value={email}
          onChange={setEmail}
          isDisabled={isPending}
        />
        <TextInput
          label="New password"
          htmlName="password"
          type="password"
          value={password}
          onChange={setPassword}
          isDisabled={isPending}
        />
        <Button
          label="Submit"
          variant="primary"
          type="submit"
          isLoading={isPending}
        />
      </VStack>
    </form>
  );
}
