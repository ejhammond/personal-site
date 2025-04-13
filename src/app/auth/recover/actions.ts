'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/supabase/server';

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

  if (typeof next === 'string') {
    redirect(next);
  } else {
    return { type: 'success' };
  }
}
