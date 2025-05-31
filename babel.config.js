module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],   // This helps resolve `~` relative to `src`
          alias: {
            '~': './src',
          },
        },
      ],
    ],
  };
};
