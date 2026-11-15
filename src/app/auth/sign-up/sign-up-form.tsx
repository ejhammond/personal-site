'use client';

import { useActionState, useState } from 'react';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { VStack } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { signUp, SignUpFormState } from './actions';

export default function SignUpForm({ next }: { next: string }) {
  const [state, action, isPending] = useActionState<SignUpFormState, FormData>(
    signUp,
    {},
  );
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form id="sign-up" action={action}>
      <input type="hidden" name="next" value={next} />
      <VStack gap={4}>
        {state.errors?.form != null && (
          <Banner status="error" title={state.errors.form} container="card" />
        )}
        <TextInput
          label="Display name"
          htmlName="displayName"
          type="text"
          isRequired
          value={displayName}
          onChange={setDisplayName}
          isDisabled={isPending}
          status={
            state.errors?.displayName != null
              ? { type: 'error', message: state.errors.displayName }
              : undefined
          }
        />
        <TextInput
          label="Email"
          htmlName="email"
          type="email"
          isRequired
          value={email}
          onChange={setEmail}
          isDisabled={isPending}
          status={
            state.errors?.email != null
              ? { type: 'error', message: state.errors.email }
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
