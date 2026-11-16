import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { Link } from '@astryxdesign/core/Link';
import { ColorModeSwitch } from '@/components/color-mode-switch';
import { ColorModeImage } from '@/components/color-mode-image';
import { MdxCounter } from '@/components/mdx-counter';
import { MdxPre } from '@/components/mdx-pre';

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // props = {...props} hack avoids a weird server component error https://github.com/hashicorp/next-mdx-remote/issues/405
    // MDX images pass alt through props (from Markdown ![alt](src)); the
    // rule can't see it through the spread.
    // eslint-disable-next-line jsx-a11y/alt-text
    Image: (props) => <Image {...props} />,
    Counter: () => <MdxCounter />,
    pre: MdxPre,
    ColorModeSwitch, // not used yet
    ColorModeImage,
    a: ({ href, children }) => <Link href={href}>{children}</Link>,
  };
}
