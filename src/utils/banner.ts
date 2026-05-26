import type { ImageRequireSource } from 'react-native';

// Metro's require.context bundles every PNG in assets/images at build time.
// The API returns banner paths like "images/<uuid>.png" — strip the prefix
// and look up the bundled module. Falls back to assets/global.svg when the
// path is missing or the file isn't bundled.
const banners = require.context('../../assets/images', false, /\.png$/);
const fallback: ImageRequireSource = require('@assets/global.svg');

export const getBannerSource = (path?: string): ImageRequireSource => {
  if (!path) return fallback;
  const key = `./${path.replace(/^images\//, '')}`;
  try {
    return banners(key) ?? fallback;
  } catch {
    return fallback;
  }
};
