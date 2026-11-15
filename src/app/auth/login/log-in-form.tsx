'use client';

import { useActionState, useState } from 'react';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { VStack } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { logIn, LogInFormState } from './actions';

export default function LogInForm({ next }: { next: string }) {
  const [actionState, action, isPending] = useActionState<
    LogInFormState,
    FormData
  >(logIn, {});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form id="log-in" action={action}>
      <input type="hidden" name="next" value={next} />
      <VStack gap={4}>
        {actionState.errors?.form != null && (
          <Banner
            status="error"
            title={actionState.errors.form}
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
            actionState.errors?.email != null
              ? { type: 'error', message: actionState.errors.email }
              : undefined
          }
        />
        <TextInput
          label="Password"
          htmlName="password"
          type="password"
          isRequired
          value={password}
          onChange={setPassword}
          isDisabled={isPending}
          status={
            actionState.errors?.password != null
              ? { type: 'error', message: actionState.errors.password }
              : undefined
          }
        />
        <Button
          label="Log in"
          variant="primary"
          type="submit"
          isLoading={isPending}
        />
      </VStack>
    </form>
  );
}
