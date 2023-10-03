const config = {
  useTabs: false,
  tabWidth: 2,
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.mdx'],
      options: {
        printWidth: 40,
      },
    },
  ],
};

export default config;
