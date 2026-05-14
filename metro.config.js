const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@firebase/app' || moduleName === 'firebase/app') {
    return context.resolveRequest(
      context,
      '@firebase/app/dist/esm/index.esm2017.js',
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
