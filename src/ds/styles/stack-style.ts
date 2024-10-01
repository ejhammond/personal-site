import cx from '@/utils/cx';
import './stack.css';

type TDirection = 'horizontal' | 'vertical';
type TCrossAlign = 'stretch' | 'center' | 'start' | 'end';
type TDisplay = 'block' | 'inline';
type TGap = 'xs' | 'sm' | 'md' | 'lg';
type TWrap = 'wrap' | 'nowrap';

export type StackOptions = Readonly<{
  gap?: TGap;
  direction: TDirection;
  crossAlign?: TCrossAlign;
  display?: TDisplay;
  wrap?: TWrap;
}>;

const directionStyles: Record<TDirection, string> = {
  horizontal: 'stack-direction-row',
  vertical: 'stack-direction-column',
};

const crossAlignStyles: Record<TCrossAlign, string> = {
  stretch: 'stack-align-items-stretch',
  center: 'stack-align-items-center',
  start: 'stack-align-items-start',
  end: 'stack-align-items-end',
};

const displayStyles: Record<TDisplay, string> = {
  block: 'stack-display-flex',
  inline: 'stack-display-inline-flex',
};

const gapStyles: Record<TGap, string> = {
  xs: 'stack-gap-4',
  sm: 'stack-gap-8',
  md: 'stack-gap-16',
  lg: 'stack-gap-32',
};

const wrapStyles: Record<TWrap, string> = {
  wrap: 'stack-wrap-wrap',
  nowrap: 'stack-wrap-nowrap',
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
