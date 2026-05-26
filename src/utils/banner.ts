import type { ImageRequireSource } from 'react-native';

// Metro's require.context bundles every PNG in assets/images at build time.
// The API returns banner paths like "images/<uuid>.png" — strip the prefix
// and look up the bundled module.
const banners = require.context('../../assets/images', false, /\.png$/);
const fallback: ImageRequireSource = require('@assets/global.svg');

// Returns the bundled module for a banner path, or null if the path is missing
// or not bundled. Lets callers decide what to do with the miss (fall back to a
// remote CDN, show a placeholder, etc.).
export const tryGetBannerSource = (path?: string): ImageRequireSource | null => {
  if (!path) return null;
  const key = `./${path.replace(/^images\//, '')}`;
  try {
    return banners(key) ?? null;
  } catch {
    return null;
  }
};

// Same as tryGetBannerSource but returns the global SVG fallback instead of
// null. Use this where the caller doesn't care about distinguishing miss vs hit.
export const getBannerSource = (path?: string): ImageRequireSource =>
  tryGetBannerSource(path) ?? fallback;

export const getGlobalFallback = (): ImageRequireSource => fallback;
