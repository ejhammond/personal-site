'use client';

import { useActionState, useState } from 'react';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { VStack } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { resetPassword, ResetPasswordFormState } from './actions';

export default function ResetPasswordForm({ next }: { next: string }) {
  const [state, action, isPending] = useActionState<
    ResetPasswordFormState,
    FormData
  >(resetPassword, {});
  const [password, setPassword] = useState('');

  return (
    <form id="reset-password" action={action}>
      <input type="hidden" name="next" value={next} />
      <VStack gap={4}>
        {state.errors?.form != null && (
          <Banner status="error" title={state.errors.form} container="card" />
        )}
        <TextInput
          label="New password"
          htmlName="password"
          type="password"
          isRequired
          value={password}
          onChange={setPassword}
          isDisabled={isPending}
          status={
            state.errors?.password != null
              ? { type: 'error', message: state.errors.password }
              : undefined
          }
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
