import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import { Theme } from '@astryxdesign/core/theme';
import { themes, defaultThemeSlug } from '@/astryx-themes';
import { AppShell } from '@astryxdesign/core/AppShell';
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import type { Metadata } from 'next';
import ayhotaLogo from '@/images/ayhota-logo.png';
import Image from 'next/image';
import { AccountLink } from './account-link';
import { RootProviders } from './root-providers';
import { createClient } from '@/supabase/server';

export const metadata: Metadata = {
  title: 'Ayhota',
  applicationName: 'Ayhota',
  other: {
    'apple-mobile-web-app-title': 'Ayhota',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <RootProviders>
        <body>
          <Theme theme={themes[defaultThemeSlug]} mode="system">
            <AppShell
              height="fill"
              topNav={
                <TopNav
                  label="Top navigation"
                  heading={
                    <TopNavHeading
                      logo={
                        <Image
                          src={ayhotaLogo}
                          alt="Ayhota logo"
                          width={48}
                          height={48}
                        />
                      }
                      heading="Ayhota"
                      headingHref="/"
                    />
                  }
                  startContent={
                    <>
                      <TopNavItem label="Articles" href="/articles" />
                      <TopNavItem label="D&D" href="/dnd" />
                      <TopNavItem label="Finance" href="/finance" />
                      <TopNavItem label="Fitness" href="/fitness" />
                    </>
                  }
                  endContent={<AccountLink isLoggedIn={user != null} />}
                />
              }
            >
              {children}
            </AppShell>
          </Theme>
        </body>
      </RootProviders>
    </html>
  );
}
