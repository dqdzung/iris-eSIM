// Metro's require.context bundles every PNG in assets/images at build time.
// The API returns banner paths like "images/<uuid>.png" — strip the prefix
// and look up the bundled module. Falls back to assets/global.svg when the
// path is missing or the file isn't bundled.
// @ts-expect-error require.context is a Metro extension not in the standard TS lib.
const banners = require.context('../../assets/images', false, /\.png$/);
const fallback = require('@assets/global.svg');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBannerSource = (path?: string): any => {
  if (!path) return fallback;
  const key = `./${path.replace(/^images\//, '')}`;
  try {
    return banners(key) ?? fallback;
  } catch {
    return fallback;
  }
};
