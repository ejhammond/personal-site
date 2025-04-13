'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/supabase/server';

export type ResetPasswordFormState = {
  errors?: {
    password?: string;
    form?: string;
  };
};

export async function resetPassword(
  _prevFormState: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const supabase = await createClient();

  const next = formData.get('next');
  const password = formData.get('password');

  if (typeof next !== 'string') {
    return { errors: { form: 'Internal error - missing next route' } };
  }

  if (typeof password !== 'string' || password === '') {
    return { errors: { password: 'Invalid password' } };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error != null) {
    return { errors: { form: error.message } };
  }

  revalidatePath('/');
  redirect(next);
}
