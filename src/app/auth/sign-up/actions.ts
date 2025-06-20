'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/supabase/server';

export type SignUpFormState = {
  errors?: {
    email?: string;
    password?: string;
    displayName?: string;
    form?: string;
  };
};

export async function signUp(
  _prevFormState: SignUpFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const next = formData.get('next');
  const email = formData.get('email');
  const password = formData.get('password');
  const displayName = formData.get('displayName');

  if (typeof next !== 'string') {
    return { errors: { form: 'Internal error - missing next route' } };
  }

  const errors: SignUpFormState['errors'] = {};

  if (typeof displayName !== 'string' || displayName === '') {
    errors['displayName'] = 'Invalid display name';
  }
  if (typeof email !== 'string' || email === '') {
    errors['email'] = 'Invalid email';
  }
  if (typeof password !== 'string' || password === '') {
    errors['password'] = 'Invalid password';
  }

  // this implies that displayName, email, and password are strings
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const { error } = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
    options: {
      data: { display_name: displayName as string },
    },
  });

  if (error != null) {
    redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/');
  redirect(next);
}
