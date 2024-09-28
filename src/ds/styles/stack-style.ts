import { css, cx } from '@/panda/css';
import { CSSProperties } from 'react';

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

const directionStyles: Record<TDirection, CSSProperties> = {
  horizontal: { flexDirection: 'row' },
  vertical: { flexDirection: 'column' },
};

const crossAlignStyles: Record<TCrossAlign, CSSProperties> = {
  stretch: { alignItems: 'stretch' },
  center: { alignItems: 'center' },
  start: { alignItems: 'start' },
  end: { alignItems: 'end' },
};

const displayStyles: Record<TDisplay, CSSProperties> = {
  block: { display: 'flex' },
  inline: { display: 'inline-flex' },
};

const gapStyles: Record<TGap, CSSProperties> = {
  sm: { gap: '8px' },
  md: { gap: '16px' },
  lg: { gap: '32px' },
};

const wrapStyles: Record<TWrap, CSSProperties> = {
  wrap: { flexWrap: 'wrap' },
  nowrap: { flexWrap: 'nowrap' },
};

export function stack({
  display = 'block',
  direction,
  gap,
  crossAlign,
  wrap,
}: StackOptions): CSSProperties {
  return {
    ...displayStyles[display],
    ...directionStyles[direction],
    ...(crossAlign != null ? crossAlignStyles[crossAlign] : {}),
    ...(gap != null ? gapStyles[gap] : {}),
    ...(wrap != null ? wrapStyles[wrap] : {}),
  };
}
