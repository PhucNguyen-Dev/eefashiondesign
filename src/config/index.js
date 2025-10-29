import * as Constants from './constants';

// Environment detection
const ENV = __DEV__ ? 'development' : 'production';

// Environment-specific configurations
const config = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    enableLogging: true,
    enableDebugMode: true,
    apiTimeout: 10000,
  },
  production: {
    apiUrl: 'https://api.fashioncraft.com/api',
    enableLogging: false,
    enableDebugMode: false,
    apiTimeout: 5000,
  },
};

// Get current environment config
const getConfig = () => config[ENV];

// Export everything
export { Constants };
export default {
  ...getConfig(),
  ...Constants,
  env: ENV,
};
