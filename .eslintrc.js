module.exports = {
  extends: ['plugin:@ejhammond/react'],
  overrides: [
    {
      files: ['*rc.js', '*.config.js', 'gatsby-config.js', 'gatsby-node.js'],
      extends: ['plugin:@ejhammond/node'],
    },
    {
      files: ['gatsby-config.js'],
      rules: { '@typescript-eslint/camelcase': 'off' },
    },
  ],
};
