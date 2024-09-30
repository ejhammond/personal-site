import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { ColorModeSwitch } from '@/components/color-mode-switch';
import { ColorModeImage } from '@/components/color-mode-image';
import { Counter } from '@/ds/counter';
import { Link } from '@/ds/link';

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // props = {...props} hack avoids a weird server component error https://github.com/hashicorp/next-mdx-remote/issues/405
    Image: (props) => <Image {...props} />,
    Counter: (props) => <Counter {...props} />,
    ColorModeSwitch, // not used yet
    ColorModeImage,
    a: ({ href, children }) => <Link href={href} children={children} />,
  };
}
