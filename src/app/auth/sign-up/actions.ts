'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/supabase/server';
import { isSafeNextPathname } from '@/utils/auth';

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
  if (
    typeof displayName === 'string' &&
    displayName.length > 200
  ) {
    errors['displayName'] = 'Display name must be 200 characters or fewer';
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
    return { errors: { form: error.message } };
  }

  revalidatePath('/');
  // The hidden field is attacker-controlled; only same-origin paths are
  // safe to redirect to.
  redirect(isSafeNextPathname(next) ? next : '/');
}
