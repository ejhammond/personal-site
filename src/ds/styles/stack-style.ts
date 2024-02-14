import { css, cx } from '@/panda/css';

type TDirection = 'horizontal' | 'vertical';
type TCrossAlign = 'stretch' | 'center' | 'start' | 'end';
type TDisplay = 'block' | 'inline';
type TGap = 'sm' | 'md' | 'lg';
type TWrap = 'wrap' | 'nowrap';

export type StackOptions = Readonly<{
  gap?: TGap;
  direction: TDirection;
  crossAlign?: TCrossAlign;
  display?: TDisplay;
  wrap?: TWrap;
}>;

const directionStyles: Record<TDirection, string> = {
  horizontal: css({ flexDirection: 'row' }),
  vertical: css({ flexDirection: 'column' }),
};

const crossAlignStyles: Record<TCrossAlign, string> = {
  stretch: css({ alignItems: 'stretch' }),
  center: css({ alignItems: 'center' }),
  start: css({ alignItems: 'start' }),
  end: css({ alignItems: 'end' }),
};

const displayStyles: Record<TDisplay, string> = {
  block: css({ display: 'flex' }),
  inline: css({ display: 'inline-flex' }),
};

const gapStyles: Record<TGap, string> = {
  sm: css({ gap: 'sm' }),
  md: css({ gap: 'md' }),
  lg: css({ gap: 'lg' }),
};

const wrapStyles: Record<TWrap, string> = {
  wrap: css({ flexWrap: 'wrap' }),
  nowrap: css({ flexWrap: 'nowrap' }),
};

export function stack({
  display = 'block',
  direction,
  gap,
  crossAlign,
  wrap,
}: StackOptions): string {
  return cx(
    displayStyles[display],
    directionStyles[direction],
    crossAlign != null && crossAlignStyles[crossAlign],
    gap != null && gapStyles[gap],
    wrap != null && wrapStyles[wrap],
  );
}
