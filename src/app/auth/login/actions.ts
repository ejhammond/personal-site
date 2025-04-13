'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/supabase/server';

export type LogInFormState = {
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
};

export async function logIn(
  _prevFormState: LogInFormState,
  formData: FormData,
): Promise<LogInFormState> {
  const supabase = await createClient();

  const next = formData.get('next');
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof next !== 'string') {
    return { errors: { form: 'Internal error - missing next route' } };
  }

  const errors: LogInFormState['errors'] = {};
  if (typeof email !== 'string' || email === '') {
    errors['email'] = 'Invalid email';
  }

  if (typeof password !== 'string' || password === '') {
    errors['password'] = 'Invalid password';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  });

  if (error != null) {
    return { errors: { form: error.message } };
  }

  revalidatePath('/');
  redirect(next);
}
