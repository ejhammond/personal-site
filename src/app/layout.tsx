import './root.css';

import type { Metadata, Viewport } from 'next';
import { Montserrat, Fira_Code } from 'next/font/google';
import ayhotaLogo from '@/images/ayhota-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { css, cx } from '@/panda/css';
import { ColorModeToggle } from '@/components/color-mode-toggle';
import { Breadcrumbs } from '@/ds/breadcrumbs';
import { PostHydration } from '@/components/post-hydration';
import {
  AppColorModePreference,
  COLOR_MODE_STORAGE_KEY,
  getBodyClassForColorMode,
} from '@/utils/color-mode';

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
}: Readonly<{ children: React.ReactNode; className?: string | undefined }>) {
  return (
    <div
      className={cx(
        css({
          marginInline: 'auto',
          maxWidth: 900,
          paddingInline: 'md',
        }),
        className,
      )}
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
  const cookieStore = cookies();
  const colorModePreferenceCookie = cookieStore.get(COLOR_MODE_STORAGE_KEY)
    ?.value as AppColorModePreference | undefined;

  /**
   * If the color mode cookie is missing or is set to "system" we can just let
   * our CSS (prefers-color-scheme) handle it. If there's an explicit preference
   * then we'll set the initial class on the body.
   *
   * This lets us SSR the correct color mode for the user which avoids a flash
   * of the wrong color mode in the initial render.
   *
   * Note that after the initial render, we manage the color mode class by
   * directly manipulating the DOM (see color-mode-toggle.tsx). This is so that
   * the layout can remain a server component. TODO: should we just make this
   * a client component?
   */
  const bodyClassForColorMode = (() => {
    if (
      colorModePreferenceCookie == null ||
      colorModePreferenceCookie === 'system'
    ) {
      return null;
    }
    return getBodyClassForColorMode(colorModePreferenceCookie);
  })();

  async function setColorModeCookie(
    colorModePreference: AppColorModePreference,
  ) {
    'use server';
    cookies().set(COLOR_MODE_STORAGE_KEY, colorModePreference);
  }

  return (
    <html
      lang="en"
      // exposes css variables for each font. The variables are used in the Panda theme
      className={cx(normalFont.variable, monospaceFont.variable)}
    >
      <body className={cx(css({ mb: 'lg' }), bodyClassForColorMode)}>
        <header
          className={css({
            backgroundColor: 'brand',
            py: 'md',
            mb: 'md',
          })}
        >
          <CappedWidth
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
            })}
          >
            <h1>
              <Link
                className={css({
                  color: 'white',

                  display: 'flex',
                  alignItems: 'center',

                  // by default we underline links on hover, but not on the title
                  '&:hover': {
                    textDecoration: 'none',
                  },
                })}
                href="/"
              >
                <Image
                  src={ayhotaLogo}
                  alt="Ayhota logo"
                  className={css({
                    height: '48px',
                    width: '48px',
                    mr: 'sm',
                  })}
                />
              </Link>
            </h1>
            <PostHydration fallback={null}>
              <ColorModeToggle
                className={css({ alignSelf: 'center' })}
                cookiePreference={colorModePreferenceCookie}
                setCookiePreference={setColorModeCookie}
              />
            </PostHydration>
          </CappedWidth>
        </header>
        <CappedWidth>
          <Breadcrumbs className={css({ mb: 'lg' })} />
          <main>{children}</main>
        </CappedWidth>
      </body>
    </html>
  );
}
