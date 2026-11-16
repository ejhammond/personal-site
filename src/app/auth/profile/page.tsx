import { SiteFooter } from '@/app/site-footer';
import { Button } from '@astryxdesign/core/Button';
import { HStack, StackItem } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Text';
import { Center } from '@astryxdesign/core/Center';
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryxdesign/core/Layout';
import { VStack } from '@astryxdesign/core/Stack';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import EditProfileForm from './edit-profile-form';
import type { CSSProperties } from 'react';

// Cap the column but let it shrink to fit narrow screens (Stack has no
// maxWidth prop, so it's set here).
const contentStyle: CSSProperties = {
  width: '100%',
  maxWidth: 480,
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect(`/auth/login?next=${encodeURIComponent('/auth/profile')}`);
  }

  // ensure that the ProfileForm is re-mounted if name/email change
  const profileFormKey = `${user.user_metadata.display_name}:${user.email}`;

  return (
    <Layout
      height="fill"
      contentWidth={1200}
      footer={
        <LayoutFooter hasDivider padding={4}>
          <SiteFooter />
        </LayoutFooter>
      }
      header={
        <LayoutHeader hasDivider>
          <HStack vAlign="center">
            <StackItem size="fill">
              <Heading level={1}>Profile</Heading>
            </StackItem>
            <form id="logout" action="/auth/logout" method="post">
              <Button label="Sign out" type="submit" />
            </form>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={8}>
          <Center axis="horizontal">
            <VStack gap={4} style={contentStyle}>
              <EditProfileForm
                key={profileFormKey}
                initialDisplayName={user.user_metadata.display_name}
                initialEmail={user.email}
              />
            </VStack>
          </Center>
        </LayoutContent>
      }
    />
  );
}
