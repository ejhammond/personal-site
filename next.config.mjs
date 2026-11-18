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
  poweredByHeader: false,
  // Baked in at build time: the footer copyright year must be a constant
  // during prerendering — calling new Date() in the render path errors
  // under Cache Components ("unstable value"). It refreshes on the next
  // deploy after New Year.
  env: {
    NEXT_PUBLIC_COPYRIGHT_YEAR: String(new Date().getFullYear()),
  },
  // Cache Components (Partial Prerendering): pages with a
  // Suspense-isolated dynamic hole (the nav login icon) prerender their
  // static shell at build time and stream the hole at request time.
  // Without this, any dynamic hole — even inside Suspense — keeps the
  // whole route dynamic.
  cacheComponents: true,
  images: {
    // Serve AVIF where supported (smaller than WebP), WebP otherwise.
    formats: ['image/avif', 'image/webp'],
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
