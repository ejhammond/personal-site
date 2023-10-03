'use client';

import { useCallback, useEffect, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useMediaQuery } from '@/utils/use-media-query';
import { css } from '@/panda/css';
import { Selector, TSelectorItem } from './ds/selector';
import { Button } from './ds/button';
import {
  AppColorModePreference,
  COLOR_MODE_STORAGE_KEY,
  ColorMode,
  DEFAULT_COLOR_MODE,
  SystemColorModePreference,
  getCurrentColorMode,
  setColorMode,
} from '@/utils/color-mode';

const SELECTOR_ITEMS: ReadonlyArray<TSelectorItem<AppColorModePreference>> = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

type Props = Readonly<{
  className?: string;
  cookiePreference: AppColorModePreference | undefined;
  setCookiePreference: (pref: AppColorModePreference) => void;
}>;

export function ColorModeToggle({
  className,
  cookiePreference,
  setCookiePreference,
}: Props) {
  const appPreference = cookiePreference ?? 'system';

  const systemPrefersLight = useMediaQuery('(prefers-color-scheme: light)');
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const systemPreference: SystemColorModePreference = useMemo(() => {
    if (systemPrefersLight === systemPrefersDark) {
      return null;
    }
    return systemPrefersLight ? 'light' : 'dark';
  }, [systemPrefersLight, systemPrefersLight]);

  const colorMode: ColorMode = useMemo(() => {
    if (appPreference === 'system') {
      return systemPreference ?? DEFAULT_COLOR_MODE;
    }

    return appPreference;
  }, [appPreference, systemPreference]);

  const setAppPreference = useCallback((preference: AppColorModePreference) => {
    /**
     * This is an async fn that makes a request to our server to store the
     * pref in a cookie.
     */
    setCookiePreference(preference);
  }, []);

  useEffect(() => {
    const currentMode = getCurrentColorMode();

    if (colorMode !== currentMode) {
      setColorMode(colorMode);
    }
  }, [colorMode]);

  return (
    <Selector<AppColorModePreference>
      className={className}
      label="Color mode"
      isLabelHidden={true}
      value={appPreference}
      onChange={setAppPreference}
      button={
        <Button variant="flat">
          {colorMode === 'dark' ? (
            <FaMoon className={css({ color: 'text-on-brand' })} />
          ) : (
            <FaSun className={css({ color: 'text-on-brand' })} />
          )}
        </Button>
      }
      items={SELECTOR_ITEMS}
    />
  );
}
