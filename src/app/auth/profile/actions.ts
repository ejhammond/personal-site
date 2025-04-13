'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/supabase/server';

export type UpdateUserFormState =
  | {
      type: 'error';
      errors: {
        form?: string;
      };
    }
  | { type: 'success' }
  | { type: null };

export async function updateUser(
  _prevFormState: UpdateUserFormState,
  formData: FormData,
): Promise<UpdateUserFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect(`/auth/login`);
  }

  const email = formData.get('email');
  const password = formData.get('password');
  const displayName = formData.get('display-name');

  const updates: {
    email?: string;
    data?: {
      display_name?: string;
    };
    password?: string;
  } = {};

  if (typeof email === 'string' && email !== '' && email !== user.email) {
    updates.email = email;
  }
  if (
    typeof displayName === 'string' &&
    displayName !== '' &&
    displayName !== user.user_metadata.display_name
  ) {
    updates.data = { display_name: displayName };
  }
  if (typeof password === 'string' && password !== '') {
    updates.password = password;
  }

  const { error } = await supabase.auth.updateUser(updates);

  if (error != null) {
    return { type: 'error', errors: { form: error.message } };
  }

  revalidatePath('/');
  return { type: 'success' };
}
