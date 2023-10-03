/**
 * Conditions allow you to swap out token values when certain criteria are met
 * e.g. tokens.textColor.value = { base: 'black', _dark: 'white' }
 */

export const conditions = {
  // OS default dark theme
  osDark: '@media (prefers-color-scheme: dark)',

  // OS default light theme
  osLight: '@media (prefers-color-scheme: light)',

  // explicit dark mode via toggle
  dark: '&.dark-mode, .dark-mode &',

  // explicit dark mode via toggle
  light: '&.light-mode, .light-mode &',

  hover: '&:hover',
};
