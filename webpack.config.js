const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@react-native-async-storage/async-storage',
          '@tamagui',
          'react-native-reanimated',
          'react-native-gesture-handler',
        ],
      },
    },
    argv
  );

  // Add crypto and stream polyfills
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
  };

  // Add Tamagui-specific extensions
  config.resolve.extensions = [
    '.web.tsx',
    '.web.ts',
    '.web.jsx',
    '.web.js',
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
    ...config.resolve.extensions.filter(
      ext => !['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'].includes(ext)
    ),
  ];

  // Optimize bundle size
  const isProd = (argv && argv.mode === 'production') || process.env.NODE_ENV === 'production' || config.mode === 'production';
  if (isProd) {
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          tamagui: {
            test: /[\\/]node_modules[\\/]@tamagui[\\/]/,
            name: 'tamagui',
            priority: 20,
          },
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            priority: 20,
          },
        },
      },
    };
  }

  return config;
};
