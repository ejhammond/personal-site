import createMDXPlugin from '@next/mdx';
import prettyCode from 'rehype-pretty-code';
import toc from 'remark-toc';
import autoLinkHeadings from 'rehype-autolink-headings';

const withMDX = createMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [toc],
    rehypePlugins: [
      [
        prettyCode,
        {
          theme: { light: 'github-light', dark: 'github-dark-dimmed' },
          keepBackground: false,
        },
      ],
      autoLinkHeadings,
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/ejhammond/**',
      },
    ],
  },
};

export default withMDX(nextConfig);
