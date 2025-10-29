const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@react-native-async-storage/async-storage',
          '@tamagui',
        ],
      },
    },
    argv
  );

  // Add crypto polyfill
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
  };

  // Add Tamagui extensions
  config.resolve.extensions = [
    '.web.tsx',
    '.web.ts',
    '.web.js',
    '.ts',
    '.tsx',
    ...config.resolve.extensions,
  ];

  return config;
};
