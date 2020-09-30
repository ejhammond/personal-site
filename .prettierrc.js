const ejhammondConfig = require('@ejhammond/jskit/configs/shared/prettier');

module.exports = {
  ...ejhammondConfig,
  overrides: [
    ...(ejhammondConfig.overrides || []),
    {
      files: ['*.mdx'],
      options: {
        printWidth: 40,
      },
    },
  ],
};
