'use client';

import { Label as AriaLabel, LabelProps } from 'react-aria-components';
import './index.css';

export function Label(props: LabelProps) {
  return <AriaLabel {...props} />;
}
