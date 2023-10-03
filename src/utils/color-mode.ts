export type ColorMode = 'dark' | 'light';

/**
 * Color mode preference for this app
 */
export type AppColorModePreference = 'dark' | 'light' | 'system';

/**
 * Color mode preference for the OS / system
 *
 * null implies "no preference"
 */
export type SystemColorModePreference = 'dark' | 'light' | null;

const DARK_MODE_CLASS = 'dark-mode';
const LIGHT_MODE_CLASS = 'light-mode';
export function getBodyClassForColorMode(colorMode: ColorMode): string {
  switch (colorMode) {
    case 'light':
      return LIGHT_MODE_CLASS;
    case 'dark':
      return DARK_MODE_CLASS;
  }
}

/**
 * The source of truth for this is actually in the Panda config where where we
 * define withColorMode(). We store it here in case we need to read the default
 * value. e.g. if no pref is set and we need to display the current color mode.
 */
export const DEFAULT_COLOR_MODE: ColorMode = 'dark';

/**
 * Returns the current color mode
 */
export function getCurrentColorMode(): ColorMode {
  const { body } = document;

  if (body.classList.contains(DARK_MODE_CLASS)) {
    return 'dark';
  } else if (body.classList.contains(LIGHT_MODE_CLASS)) {
    return 'light';
  } else {
    return DEFAULT_COLOR_MODE;
  }
}

/**
 * If we change the contract between our app and the local storage value, we
 * could run in to issues. e.g. a user has an old value stored that our app no
 * long knows how to handle. This "version" ensures that our app only ever deals
 * with local storage values that were created by on the same API version.
 * Bumping this will cause all users to lose any stored preferences, so do it
 * sparingly.
 */
const STORAGE_API_VERSION = 1;
export const COLOR_MODE_STORAGE_KEY = `color-mode-v${STORAGE_API_VERSION}`;

/**
 * Adds a class to the document body based on the given color mode. This is
 * what ultimately tells the rest of the app which colors to use.
 *
 * Note that this fn is inlined into the body as-is, so it must not use any
 * JS syntax that would be transpiled and--if it uses any variables from outside
 * of its own scope--those variables must also be inlined
 * (e.g. DARK_MODE_CLASS)
 */
export function setColorMode(colorMode: ColorMode) {
  const { body } = document;

  body.classList.remove(DARK_MODE_CLASS, LIGHT_MODE_CLASS);
  body.classList.add(getBodyClassForColorMode(colorMode));
}
