'use client';

import { useActionState, useState } from 'react';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { VStack } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { requestPasswordReset, RequestPasswordResetFormState } from './actions';

export default function RequestPasswordResetForm({
  next,
}: {
  next?: string | null;
}) {
  const [actionState, action, isPending] = useActionState<
    RequestPasswordResetFormState,
    FormData
  >(requestPasswordReset, { type: null });
  const [email, setEmail] = useState('');

  return (
    <form id="reset-password" action={action}>
      {next != null && <input type="hidden" name="next" value={next} />}
      <VStack gap={4}>
        {actionState.type === 'error' && actionState.errors.form != null && (
          <Banner
            status="error"
            title={actionState.errors.form}
            container="card"
          />
        )}
        {actionState.type === 'success' && (
          <Banner
            status="success"
            title="Check your email for a reset link!"
            container="card"
          />
        )}
        <TextInput
          label="Email"
          htmlName="email"
          type="email"
          isRequired
          value={email}
          onChange={setEmail}
          isDisabled={isPending}
          status={
            actionState.type === 'error' && actionState.errors.email != null
              ? { type: 'error', message: actionState.errors.email }
              : undefined
          }
        />
        <Button
          label="Request reset link"
          variant="primary"
          type="submit"
          isLoading={isPending}
        />
      </VStack>
    </form>
  );
}
