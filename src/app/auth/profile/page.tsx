import { Button } from '@/ds/button';
import { Form } from '@/ds/form';
import { createClient } from '@/supabase/server';
import EditProfileForm from './edit-profile-form';
import { VStack } from '@/ds/v-stack';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect('/auth/login');
  }

  // ensure that the ProfileForm is re-mounted if name/email change
  const profileFormKey = `${user.user_metadata.display_name}:${user.email}`;

  return (
    <VStack gap="md">
      {user.id}
      <EditProfileForm
        key={profileFormKey}
        initialDisplayName={user.user_metadata.display_name}
        initialEmail={user.email}
      />
      <Form id="logout" action="/auth/logout" method="post">
        <Button type="submit">Sign out</Button>
      </Form>
    </VStack>
  );
}
