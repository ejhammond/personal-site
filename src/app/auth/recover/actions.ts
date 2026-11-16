'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/supabase/server';
import { isSafeNextPathname } from '@/utils/auth';

export type RequestPasswordResetFormState =
  | {
      type: 'error';
      errors: {
        email?: string;
        form?: string;
      };
    }
  | { type: 'success' }
  | { type: null };

export async function requestPasswordReset(
  _prevFormState: RequestPasswordResetFormState,
  formData: FormData,
): Promise<RequestPasswordResetFormState> {
  const supabase = await createClient();

  const next = formData.get('next');
  const email = formData.get('email');

  if (typeof email !== 'string' || email === '') {
    return { type: 'error', errors: { email: 'Invalid email' } };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error != null) {
    return { type: 'error', errors: { form: error.message } };
  }

  revalidatePath('/');

  // The hidden field is attacker-controlled; only same-origin paths are
  // safe to redirect to. Anything else shows the success state instead.
  if (isSafeNextPathname(next)) {
    redirect(next);
  } else {
    return { type: 'success' };
  }
}
