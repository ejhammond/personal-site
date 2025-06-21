'use client';

import { Form } from '@/ds/form';
import { TextField } from '@/ds/text-field';
import { signUp, SignUpFormState } from './actions';
import { useActionState, useMemo } from 'react';
import FormFooter from '@/ds/form/footer';

export default function SignUpForm({ next }: { next: string }) {
  const [state, action, isPending] = useActionState<SignUpFormState, FormData>(
    signUp,
    {},
  );

  const hiddenValues = useMemo(() => new Map([['next', next]]), [next]);

  return (
    <Form
      id="sign-up"
      action={action}
      isPending={isPending}
      validationErrors={state.errors}
      footer={<FormFooter errorMessage={state.errors?.form} />}
      hiddenValues={hiddenValues}
    >
      <TextField
        label="Display name"
        name="displayName"
        type="text"
        isRequired
      />
      <TextField label="Email" name="email" type="email" isRequired />
      <TextField label="Password" name="password" type="password" isRequired />
    </Form>
  );
}
