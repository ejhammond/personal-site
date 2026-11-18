import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import { Theme } from '@astryxdesign/core/theme';
import { themes, defaultThemeSlug } from '@/astryx-themes';
import { AppShell } from '@astryxdesign/core/AppShell';
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ayhotaLogo from '@/images/ayhota-logo.png';
import Image from 'next/image';
import { AccountLink } from './account-link';
import { NavAccountLink } from './nav-account-link';
import { RootProviders } from './root-providers';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
  return (
    <html lang="en">
      {/* Preconnect for the Google Fonts @import in the Astryx theme's
          fonts.css (see src/astryx-themes.ts): the font stylesheet is
          fetched from fonts.googleapis.com and the files from
          fonts.gstatic.com, so set both connections up while the page's
          own CSS loads instead of after. React 19 hoists these to <head>. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
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
                  endContent={
                    <Suspense fallback={<AccountLink isLoggedIn={false} />}>
                      <NavAccountLink />
                    </Suspense>
                  }
                />
              }
            >
              {children}
            </AppShell>
          </Theme>
          <SpeedInsights />
        </body>
      </RootProviders>
    </html>
  );
}
