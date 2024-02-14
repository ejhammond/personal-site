import { defineConfig } from '@pandacss/dev';
import pandaTheme from '@pandacss/preset-panda';
import { utilities } from './panda-config/utilities';

type Conditions = Readonly<{
  [condition: `_${string}`]: Style;
}>;

type StyleObject = Readonly<{
  base: Style;
}> &
  Conditions;
type FlatStyleObject = Readonly<{
  base: string;
}> &
  Conditions;

type Style = string | StyleObject;
type FlatStyle = string | FlatStyleObject;

function flatten(style: string): string;
function flatten(style: StyleObject): FlatStyleObject;
function flatten(style: Style): FlatStyle {
  if (typeof style === 'string') {
    return style;
  }

  const { base, ...styles } = style;

  if (typeof base === 'string') {
    return {
      base,
      ...styles,
    };
  }

  return {
    ...styles,
    ...flatten(base),
  };
}

function withColorMode({
  base,
  light,
}: Readonly<{ base: Style; light: Style }>): FlatStyleObject {
  return flatten({
    base,
    _colorModeLight: light,
  });
}

function withSurfaceColor({
  base,
  brand,
  accent,
}: Readonly<{ base: Style; brand: Style; accent: Style }>): FlatStyleObject {
  return flatten({
    base,
    _surfaceBrand: brand,
    _surfaceAccent: accent,
  });
}

export default defineConfig({
  eject: true, // removes base theme
  preflight: true, // adds reset css
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  jsxFramework: 'react',
  utilities,
  outdir: 'src/panda',
  conditions: {
    extend: {
      colorModeLight: '.light-mode &, [data-colormode="light"] &',
      surfaceBrand: '.background-color_brand &',
      surfaceAccent: '.background-color_accent &',
    },
  },
  globalCss: {
    body: {
      fontFamily: 'normal',
      fontSize: 'md',
      color: 'text-primary',
      backgroundColor: 'bg-base',
    },
    a: {
      color: 'text-accent',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    h1: {
      fontSize: '3xl',
      fontWeight: 'bold',
      color: 'text-heading',
    },
    h2: {
      fontSize: 'xl',
      fontWeight: 'bold',
      color: 'text-heading',
    },
    h3: {
      fontSize: 'lg',
      fontWeight: 'bold',
      color: 'text-heading',
    },
    h4: {
      fontSize: 'md',
      fontWeight: 'bold',
      color: 'text-heading',
    },
    em: {
      fontStyle: 'italic',
    },
  },
  theme: {
    containerSizes: {
      '200': '200px',
      '300': '300px',
      '400': '400px',
      '500': '500px',
      '600': '600px',
      '700': '700px',
      '800': '800px',
    },
    tokens: {
      colors: pandaTheme.theme.tokens.colors,
      shadows: pandaTheme.theme.tokens.shadows,
      fonts: {
        /**
         * In order to user Next's font optimization, we've already included the
         * fonts on the page in a "global" css variable. This bit simply makes
         * the values available as Panda tokens.
         */
        normal: { value: 'var(--global-font-normal, sans-serif)' },
        monospace: { value: 'var(--global-font-monospace, monospace)' },
      },
      fontWeights: {
        normal: { value: 400 },
        bold: { value: 700 },
      },
      fontSizes: {
        sm: { value: '.875em' },
        md: { value: '1.25em' },
        lg: { value: '1.5em' },
        xl: { value: '1.75em' },
        '2xl': { value: '2em' },
        '3xl': { value: '2.25em' },
      },
      lineHeights: {
        tight: { value: 1.25 },
        normal: { value: 1.5 },
      },
      radii: {
        circle: { value: '50%' },
        square: { value: '0' },
        md: { value: '4px' },
        lg: { value: '8px' },
      },
      spacing: {
        xs: { value: '4px' },
        sm: { value: '8px' },
        md: { value: '16px' },
        lg: { value: '24px' },
        xl: { value: '32px' },
      },
    },
    semanticTokens: {
      colors: {
        'bg-base': {
          value: withColorMode({ base: '#181818', light: 'white' }),
        },
        'bg-layer': {
          value: withColorMode({
            base: '#262626',
            light: '{colors.bg-base}',
          }),
        },
        'bg-code': {
          value: withColorMode({ base: '#262626', light: '#F3F3F3' }),
        },
        brand: {
          value: withColorMode({ base: '#25364C', light: '#385170' }),
        },
        accent: {
          value: withColorMode({ base: '#26CEAD', light: '#0C9479' }),
        },
        'text-primary': {
          value: withSurfaceColor({
            base: withColorMode({ base: '#DDDDDD', light: '#333333' }),
            brand: '#DDDDDD',
            accent: '#333333',
          }),
        },
        'text-secondary': { value: '#999999' },
        'text-heading': {
          value: withColorMode({ base: 'white', light: 'black' }),
        },
        'text-accent': {
          value: withColorMode({ base: '#26CEAD', light: '#0C9479' }),
        },
        border: {
          value: withSurfaceColor({
            base: withColorMode({ base: '#DDDDDD', light: '#AAAAAA' }),
            brand: '#DDDDDD',
            accent: '#AAAAAA',
          }),
        },
        danger: { value: '#F44336' },
      },
    },
  },
});
