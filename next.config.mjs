import createMDXPlugin from '@next/mdx';

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: { light: 'github-light', dark: 'github-dark-dimmed' },
  keepBackground: false,
  defaultLang: 'ts',
};

const withMDX = createMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    // Plugins are named by module specifier (not imported) so Turbopack can
    // serialize the loader options; the MDX loader resolves them from the
    // project root. (Next 16 builds/dev run on Turbopack by default.)
    remarkPlugins: ['remark-toc'],
    rehypePlugins: [
      ['rehype-pretty-code', prettyCodeOptions],
      'rehype-autolink-headings',
    ],
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
