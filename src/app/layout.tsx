import './reset.css';
import './root.css';

import type { Metadata, Viewport } from 'next';
import { Montserrat, Fira_Code } from 'next/font/google';
import ayhotaLogo from '@/images/ayhota-logo.png';
import Image from 'next/image';
import { SiteBreadcrumbs } from '@/components/site-breadcrumbs';
import { Link } from '@/ds/link';
import { RootProviders } from './root-providers';
import { MdAccountCircle, MdOutlineAccountCircle } from 'react-icons/md';
import { createClient } from '@/supabase/server';

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

function CappedWidth({
  children,
  className,
  style,
}: Readonly<{
  children: React.ReactNode;
  className?: string | undefined;
  style?: React.CSSProperties;
}>) {
  return (
    <div
      className={className}
      style={{
        marginInline: 'auto',
        maxWidth: 900,
        paddingInline: '16px',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

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
      <body
        style={{
          minHeight: '100dvh',
          height: 0,
        }}
      >
        <RootProviders>
          <header
            style={{
              backgroundColor: 'var(--color-brand)',
              paddingBlock: '16px',
              marginBlockEnd: '16px',
            }}
          >
            <CappedWidth style={{ flexGrow: 1, display: 'flex' }}>
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
                    <MdOutlineAccountCircle color="white" size={28} />
                  ) : (
                    <MdAccountCircle color="white" size={28} />
                  )}
                </Link>
              </h1>
            </CappedWidth>
          </header>
          <CappedWidth
            style={{
              display: 'flex',
              gap: '16px',
              flexDirection: 'column',
              paddingBlockEnd: '32px',
              overflow: 'hidden',
            }}
          >
            <SiteBreadcrumbs />
            <main>{children}</main>
          </CappedWidth>
        </RootProviders>
      </body>
    </html>
  );
}
