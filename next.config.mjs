import createMDXPlugin from '@next/mdx';
import prettyCode from 'rehype-pretty-code';
import toc from 'remark-toc';
import autoLinkHeadings from 'rehype-autolink-headings';

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: { light: 'github-light', dark: 'github-dark-dimmed' },
  keepBackground: false,
  defaultLang: 'ts',
};

const withMDX = createMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [toc],
    rehypePlugins: [[prettyCode, prettyCodeOptions], autoLinkHeadings],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'gen.ts', 'gen.tsx'],
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
