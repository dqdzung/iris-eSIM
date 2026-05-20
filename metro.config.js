const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Allow require.context() at runtime (used by src/utils/banner.ts to bundle
// every PNG under assets/images for dynamic lookup by API filename).
config.transformer.unstable_allowRequireContext = true;

module.exports = withNativeWind(config, { input: './src/global.css' });
