import './reset.css';
import './root.css';

import type { Metadata, Viewport } from 'next';
import { Montserrat, Fira_Code } from 'next/font/google';
import ayhotaLogo from '@/images/ayhota-logo.png';
import Image from 'next/image';
import { Link } from '@/ds/link';
import { RootProviders } from './root-providers';
import { createClient } from '@/supabase/server';
import { AccountLoggedInIcon, AccountLoggedOutIcon } from '@/ds/icons';

const normalFont = Montserrat({
  subsets: ['latin'],
  variable: '--global-font-normal',
});
const monospaceFont = Fira_Code({
  subsets: ['latin'],
  variable: '--global-font-monospace',
});

/*
TODO: find a way to include this in the head
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#385170">
*/

export const metadata: Metadata = {
  title: 'Ayhota',
  applicationName: 'Ayhota',
  other: {
    'apple-mobile-web-app-title': 'Ayhota',
    'msapplication-TileColor': '#385170',
  },
};

export const viewport: Viewport = {
  themeColor: '#385170',
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
    <html
      id="root"
      lang="en"
      // exposes css variables for each font.
      className={`${normalFont.variable} ${monospaceFont.variable}`}
    >
      <RootProviders>
        <body
          style={{
            minHeight: '100dvh',
            height: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <header
            style={{
              backgroundColor: 'var(--color-brand)',
              padding: '16px',
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex' }}>
              <h1
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Link
                  style={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  href="/"
                >
                  <Image
                    src={ayhotaLogo}
                    alt="Ayhota logo"
                    style={{
                      height: '48px',
                      width: '48px',
                    }}
                  />
                </Link>
                <Link href={user == null ? '/auth/login' : '/auth/profile'}>
                  {user == null ? (
                    <AccountLoggedOutIcon color="white" size={28} />
                  ) : (
                    <AccountLoggedInIcon color="white" size={28} />
                  )}
                </Link>
              </h1>
            </div>
          </header>
          <div style={{ flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
            {children}
          </div>
        </body>
      </RootProviders>
    </html>
  );
}
