'use client';

import { Link as AriaLink, LinkProps } from 'react-aria-components';
import './index.css';

export function Link(props: LinkProps) {
  return <AriaLink {...props} />;
}
