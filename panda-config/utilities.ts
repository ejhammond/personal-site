/**
 * Here we generate "utilities" for Panda. Utilities enable two key behaviors:
 * - associating token categories with css properties (e.g. "spacing" tokens
 *   can be used for margin)
 * - assigning "shorthand" keys for css properties (e.g. "m" for "margin")
 */

import { Config, PropertyConfig } from '@pandacss/dev';
import { CSSProperties } from 'react';

type Theme = NonNullable<Config['theme']>;
type Tokens = NonNullable<Theme['tokens']>;
type TokenCategory = keyof Tokens;

const cssPropsByCategory: ReadonlyMap<
  TokenCategory,
  ReadonlySet<keyof CSSProperties>
> = new Map([
  [
    'colors',
    new Set<keyof CSSProperties>([
      'color',
      'backgroundColor',
      'borderColor',
      'borderLeftColor',
      'borderRightColor',
      'borderTopColor',
      'borderBottomColor',
      'border',
      'borderColor',
    ]),
  ],
  ['fonts', new Set<keyof CSSProperties>(['fontFamily'])],
  ['fontSizes', new Set<keyof CSSProperties>(['fontSize'])],
  ['fontWeights', new Set<keyof CSSProperties>(['fontWeight'])],
  ['lineHeights', new Set<keyof CSSProperties>(['lineHeight'])],
  ['radii', new Set<keyof CSSProperties>(['borderRadius'])],
  ['shadows', new Set<keyof CSSProperties>(['boxShadow'])],
  [
    'spacing',
    new Set<keyof CSSProperties>([
      'margin',
      'marginTop',
      'marginLeft',
      'marginRight',
      'marginBottom',
      'marginBlock',
      'marginBlockStart',
      'marginBlockEnd',
      'marginInline',
      'marginInlineStart',
      'marginInlineEnd',
      'padding',
      'paddingTop',
      'paddingLeft',
      'paddingRight',
      'paddingBottom',
      'paddingBlock',
      'paddingBlockStart',
      'paddingBlockEnd',
      'paddingInline',
      'paddingInlineStart',
      'paddingInlineEnd',
      'gap',
    ]),
  ],
]);

const shorthandByCSSProp: ReadonlyMap<
  keyof CSSProperties,
  ReadonlySet<string>
> = new Map([
  // margin
  ['margin', new Set(['m'])],
  ['marginBlock', new Set(['my'])],
  ['marginBlockStart', new Set(['mt'])],
  ['marginBlockEnd', new Set(['mb'])],
  ['marginInline', new Set(['mx'])],
  ['marginInlineStart', new Set(['ml', 'ms'])],
  ['marginInlineEnd', new Set(['mr', 'me'])],
  // padding
  ['padding', new Set(['p'])],
  ['paddingBlock', new Set(['py'])],
  ['paddingBlockStart', new Set(['pt'])],
  ['paddingBlockEnd', new Set(['pb'])],
  ['paddingInline', new Set(['px'])],
  ['paddingInlineStart', new Set(['pl', 'ps'])],
  ['paddingInlineEnd', new Set(['pr', 'pe'])],
]);

function camelToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function getConfig(
  cssProp: keyof CSSProperties,
  config: PropertyConfig | void,
): PropertyConfig {
  if (config != null) {
    return { ...config };
  }

  return {
    className: camelToSnakeCase(cssProp),
  };
}

export const utilities = (() => {
  const utilitiesByCSSProp = new Map<keyof CSSProperties, PropertyConfig>();

  for (const [cssProp, shorthands] of shorthandByCSSProp) {
    const config = getConfig(cssProp, utilitiesByCSSProp.get(cssProp));
    const arr = Array.from(shorthands);
    config.shorthand = arr.length === 1 ? arr[0] : arr;
    utilitiesByCSSProp.set(cssProp, config);
  }

  for (const [category, cssProps] of cssPropsByCategory) {
    for (const cssProp of cssProps) {
      const config = getConfig(cssProp, utilitiesByCSSProp.get(cssProp));
      if (config.values == null) {
        config.values = category;
      } else if (typeof config.values === 'string') {
        config.values = [config.values, category];
      } else if (Array.isArray(config.values)) {
        config.values = [...config.values, category];
      } else {
        throw new Error('Encountered unexpected type.');
      }
      utilitiesByCSSProp.set(cssProp, config);
    }
  }

  return Object.fromEntries(utilitiesByCSSProp.entries());
})();
