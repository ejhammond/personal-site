import './reset.css';
import './root.css';

import type { Metadata, Viewport } from 'next';
import { Montserrat, Fira_Code } from 'next/font/google';
import ayhotaLogo from '@/images/ayhota-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/ds/breadcrumbs';
import SpectrumRoot from './spectrum-root';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <SpectrumRoot
          height="100%"
          minHeight="100%"
          UNSAFE_style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '16px',

            paddingBlockEnd: '32px',
            overflow: 'scroll',
          }}
        >
          <header
            style={{
              backgroundColor: 'var(--brand-color)',
              paddingBlock: '16px',
            }}
          >
            <CappedWidth style={{ flexGrow: 1, display: 'flex' }}>
              <h1>
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
              </h1>
            </CappedWidth>
          </header>
          <CappedWidth>
            <Breadcrumbs />
            <main>{children}</main>
          </CappedWidth>
        </SpectrumRoot>
      </body>
    </html>
  );
}
