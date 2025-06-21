import { Button } from '@/ds/button';
import { createClient } from '@/supabase/server';
import EditProfileForm from './edit-profile-form';
import { VStack } from '@/ds/v-stack';
import { redirect } from 'next/navigation';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';

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
    <PageLayout
      type="form"
      header={
        <PageLayoutHeader
          title="Profile"
          endContent={
            <form id="logout" action="/auth/logout" method="post">
              <Button type="submit">Sign out</Button>
            </form>
          }
        />
      }
    >
      <VStack gap="md">
        <EditProfileForm
          key={profileFormKey}
          initialDisplayName={user.user_metadata.display_name}
          initialEmail={user.email}
        />
      </VStack>
    </PageLayout>
  );
}
