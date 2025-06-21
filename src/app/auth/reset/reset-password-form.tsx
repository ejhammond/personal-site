'use client';

import { Form } from '@/ds/form';
import { TextField } from '@/ds/text-field';
import { resetPassword, ResetPasswordFormState } from './actions';
import { useActionState, useMemo } from 'react';
import FormFooter from '@/ds/form/footer';

export default function ResetPasswordForm({ next }: { next: string }) {
  const [state, action, isPending] = useActionState<
    ResetPasswordFormState,
    FormData
  >(resetPassword, {});

  const hiddenValues = useMemo(() => new Map([['next', next]]), [next]);

  return (
    <Form
      id="reset-password"
      action={action}
      isPending={isPending}
      footer={<FormFooter errorMessage={state.errors?.form} />}
      hiddenValues={hiddenValues}
    >
      <TextField
        label="New password"
        name="password"
        type="password"
        isRequired
      />
    </Form>
  );
}
