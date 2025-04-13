/**
 * THIS FILE IS GENERATED; DO NOT EDIT BY HAND
 *
 * script: scripts/gen-index.ts
 * re-gen command: npm run gen
 */
import {
  SerializableDirectoryIndex,
  hydrateDirectoryIndex,
} from '@/types/directory';

const serializableDirectoryIndex: SerializableDirectoryIndex = [
  [
    '/',
    {
      path: '/',
      files: [
        {
          path: '/apple-icon.png',
          tags: [],
        },
        {
          path: '/favicon.ico',
          tags: [],
        },
        {
          path: '/layout.tsx',
          tags: ['layout'],
        },
        {
          path: '/manifest.webmanifest',
          tags: [],
        },
        {
          path: '/reset.css',
          tags: [],
        },
        {
          path: '/root-providers.tsx',
          tags: [],
        },
        {
          path: '/root.css',
          tags: [],
        },
        {
          path: '/theme.css',
          tags: [],
        },
      ],
      subDirectories: ['/articles', '/auth', '/dnd', '/finance'],
    },
  ],
  [
    '/finance',
    {
      path: '/finance',
      files: [],
      subDirectories: ['/finance/mortgage'],
    },
  ],
  [
    '/finance/mortgage',
    {
      path: '/finance/mortgage',
      files: [
        {
          path: '/finance/mortgage/page.css',
          tags: [],
        },
        {
          path: '/finance/mortgage/page.tsx',
          tags: ['page'],
        },
      ],
      subDirectories: ['/finance/mortgage/__private__'],
    },
  ],
  [
    '/finance/mortgage/__private__',
    {
      path: '/finance/mortgage/__private__',
      files: [
        {
          path: '/finance/mortgage/__private__/amortization-table.tsx',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/content.tsx',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/loan-stats.tsx',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/mortgage-form.tsx',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/one-off-extra-payments-field.tsx',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/recurring-extra-payments-field.tsx',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/refinances-field.tsx',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/use-one-off-extra-paymentsParam.ts',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/use-original-loan-param.ts',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/use-recurring-extra-payments-param.ts',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/use-refinances-param.ts',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/use-save-params.ts',
          tags: [],
        },
        {
          path: '/finance/mortgage/__private__/use-starting-month-and-year-param.ts',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/dnd',
    {
      path: '/dnd',
      files: [],
      subDirectories: ['/dnd/d20', '/dnd/damage'],
    },
  ],
  [
    '/dnd/damage',
    {
      path: '/dnd/damage',
      files: [
        {
          path: '/dnd/damage/page.css',
          tags: [],
        },
        {
          path: '/dnd/damage/page.tsx',
          tags: ['page'],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/dnd/d20',
    {
      path: '/dnd/d20',
      files: [
        {
          path: '/dnd/d20/page.css',
          tags: [],
        },
        {
          path: '/dnd/d20/page.tsx',
          tags: ['page'],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/auth',
    {
      path: '/auth',
      files: [
        {
          path: '/auth/route.ts',
          tags: ['api-route'],
        },
      ],
      subDirectories: [
        '/auth/confirm',
        '/auth/login',
        '/auth/logout',
        '/auth/profile',
        '/auth/recover',
        '/auth/reset',
        '/auth/sign-up',
      ],
    },
  ],
  [
    '/auth/sign-up',
    {
      path: '/auth/sign-up',
      files: [
        {
          path: '/auth/sign-up/actions.ts',
          tags: [],
        },
        {
          path: '/auth/sign-up/page.tsx',
          tags: ['page'],
        },
        {
          path: '/auth/sign-up/sign-up-form.tsx',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/auth/reset',
    {
      path: '/auth/reset',
      files: [
        {
          path: '/auth/reset/actions.ts',
          tags: [],
        },
        {
          path: '/auth/reset/page.tsx',
          tags: ['page'],
        },
        {
          path: '/auth/reset/reset-password-form.tsx',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/auth/recover',
    {
      path: '/auth/recover',
      files: [
        {
          path: '/auth/recover/actions.ts',
          tags: [],
        },
        {
          path: '/auth/recover/page.tsx',
          tags: ['page'],
        },
        {
          path: '/auth/recover/request-password-reset-form.tsx',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/auth/profile',
    {
      path: '/auth/profile',
      files: [
        {
          path: '/auth/profile/actions.ts',
          tags: [],
        },
        {
          path: '/auth/profile/edit-profile-form.tsx',
          tags: [],
        },
        {
          path: '/auth/profile/page.tsx',
          tags: ['page'],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/auth/logout',
    {
      path: '/auth/logout',
      files: [
        {
          path: '/auth/logout/route.ts',
          tags: ['api-route'],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/auth/login',
    {
      path: '/auth/login',
      files: [
        {
          path: '/auth/login/actions.ts',
          tags: [],
        },
        {
          path: '/auth/login/log-in-form.tsx',
          tags: [],
        },
        {
          path: '/auth/login/page.tsx',
          tags: ['page'],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/auth/confirm',
    {
      path: '/auth/confirm',
      files: [
        {
          path: '/auth/confirm/route.ts',
          tags: ['api-route'],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/articles',
    {
      path: '/articles',
      files: [],
      subDirectories: [
        '/articles/personal-finance',
        '/articles/react-children',
        '/articles/redux',
        '/articles/responsive-react-components',
      ],
    },
  ],
  [
    '/articles/responsive-react-components',
    {
      path: '/articles/responsive-react-components',
      files: [
        {
          path: '/articles/responsive-react-components/content.mdx',
          tags: ['article-content'],
        },
        {
          path: '/articles/responsive-react-components/metadata.json',
          tags: ['article-meta'],
        },
        {
          path: '/articles/responsive-react-components/page.gen.tsx',
          tags: ['page', 'generated'],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/articles/redux',
    {
      path: '/articles/redux',
      files: [],
      subDirectories: [
        '/articles/redux/react-redux',
        '/articles/redux/redux-minus-react',
      ],
    },
  ],
  [
    '/articles/redux/redux-minus-react',
    {
      path: '/articles/redux/redux-minus-react',
      files: [
        {
          path: '/articles/redux/redux-minus-react/content.mdx',
          tags: ['article-content'],
        },
        {
          path: '/articles/redux/redux-minus-react/metadata.json',
          tags: ['article-meta'],
        },
        {
          path: '/articles/redux/redux-minus-react/page.gen.tsx',
          tags: ['page', 'generated'],
        },
      ],
      subDirectories: ['/articles/redux/redux-minus-react/images'],
    },
  ],
  [
    '/articles/redux/redux-minus-react/images',
    {
      path: '/articles/redux/redux-minus-react/images',
      files: [],
      subDirectories: [
        '/articles/redux/redux-minus-react/images/reducer-example-1',
        '/articles/redux/redux-minus-react/images/reducer-example-2',
        '/articles/redux/redux-minus-react/images/reducer-generic',
        '/articles/redux/redux-minus-react/images/state-to-ui',
      ],
    },
  ],
  [
    '/articles/redux/redux-minus-react/images/state-to-ui',
    {
      path: '/articles/redux/redux-minus-react/images/state-to-ui',
      files: [
        {
          path: '/articles/redux/redux-minus-react/images/state-to-ui/dark.png',
          tags: [],
        },
        {
          path: '/articles/redux/redux-minus-react/images/state-to-ui/light.png',
          tags: [],
        },
        {
          path: '/articles/redux/redux-minus-react/images/state-to-ui/src.excalidraw',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/articles/redux/redux-minus-react/images/reducer-generic',
    {
      path: '/articles/redux/redux-minus-react/images/reducer-generic',
      files: [
        {
          path: '/articles/redux/redux-minus-react/images/reducer-generic/dark.png',
          tags: [],
        },
        {
          path: '/articles/redux/redux-minus-react/images/reducer-generic/light.png',
          tags: [],
        },
        {
          path: '/articles/redux/redux-minus-react/images/reducer-generic/src.excalidraw',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/articles/redux/redux-minus-react/images/reducer-example-2',
    {
      path: '/articles/redux/redux-minus-react/images/reducer-example-2',
      files: [
        {
          path: '/articles/redux/redux-minus-react/images/reducer-example-2/dark.png',
          tags: [],
        },
        {
          path: '/articles/redux/redux-minus-react/images/reducer-example-2/light.png',
          tags: [],
        },
        {
          path: '/articles/redux/redux-minus-react/images/reducer-example-2/src.excalidraw',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/articles/redux/redux-minus-react/images/reducer-example-1',
    {
      path: '/articles/redux/redux-minus-react/images/reducer-example-1',
      files: [
        {
          path: '/articles/redux/redux-minus-react/images/reducer-example-1/dark.png',
          tags: [],
        },
        {
          path: '/articles/redux/redux-minus-react/images/reducer-example-1/light.png',
          tags: [],
        },
        {
          path: '/articles/redux/redux-minus-react/images/reducer-example-1/src.excalidraw',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/articles/redux/react-redux',
    {
      path: '/articles/redux/react-redux',
      files: [
        {
          path: '/articles/redux/react-redux/content.mdx',
          tags: ['article-content'],
        },
        {
          path: '/articles/redux/react-redux/metadata.json',
          tags: ['article-meta'],
        },
        {
          path: '/articles/redux/react-redux/page.gen.tsx',
          tags: ['page', 'generated'],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/articles/react-children',
    {
      path: '/articles/react-children',
      files: [
        {
          path: '/articles/react-children/content.mdx',
          tags: ['article-content'],
        },
        {
          path: '/articles/react-children/metadata.json',
          tags: ['article-meta'],
        },
        {
          path: '/articles/react-children/page.gen.tsx',
          tags: ['page', 'generated'],
        },
      ],
      subDirectories: ['/articles/react-children/images'],
    },
  ],
  [
    '/articles/react-children/images',
    {
      path: '/articles/react-children/images',
      files: [
        {
          path: '/articles/react-children/images/think-of-the-children.jpg',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
  [
    '/articles/personal-finance',
    {
      path: '/articles/personal-finance',
      files: [
        {
          path: '/articles/personal-finance/content.mdx',
          tags: ['article-content'],
        },
        {
          path: '/articles/personal-finance/metadata.json',
          tags: ['article-meta'],
        },
        {
          path: '/articles/personal-finance/page.gen.tsx',
          tags: ['page', 'generated'],
        },
      ],
      subDirectories: ['/articles/personal-finance/images'],
    },
  ],
  [
    '/articles/personal-finance/images',
    {
      path: '/articles/personal-finance/images',
      files: [
        {
          path: '/articles/personal-finance/images/bank-teller.jpeg',
          tags: [],
        },
        {
          path: '/articles/personal-finance/images/buried-candy.jpeg',
          tags: [],
        },
        {
          path: '/articles/personal-finance/images/knight-money.jpeg',
          tags: [],
        },
        {
          path: '/articles/personal-finance/images/money-choices.jpeg',
          tags: [],
        },
        {
          path: '/articles/personal-finance/images/stock-market.jpeg',
          tags: [],
        },
      ],
      subDirectories: [],
    },
  ],
];
export const directoryIndex = hydrateDirectoryIndex(serializableDirectoryIndex);
