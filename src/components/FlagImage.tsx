import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Country } from '@/types';
import { getGlobalFallback, tryGetBannerSource } from '@/utils/banner';

type Props = {
  country?: Country | null;
  className?: string;
};

const flagCdnUrl = (code: string) => `https://flagcdn.com/w160/${code.toLowerCase()}.png`;

// Renders a country flag using a 3-tier fallback chain:
//   1. Bundled PNG from country.banner (offline, instant)
//   2. flagcdn.com keyed by country.code (network, only for COUNTRY entries)
//   3. assets/global.svg (always available)
export const FlagImage = ({ country, className }: Props) => {
  const [cdnFailed, setCdnFailed] = useState(false);

  // Reset CDN retry state when the country changes (e.g. when the same
  // FlagImage instance is reused across list items).
  useEffect(() => {
    setCdnFailed(false);
  }, [country?.code]);

  const bundled = tryGetBannerSource(country?.banner);
  if (bundled) {
    return <Image source={bundled} className={className} />;
  }

  const canUseCdn =
    country?.code && country.typeLocation === 'COUNTRY' && !cdnFailed;

  if (canUseCdn) {
    return (
      <Image
        source={{ uri: flagCdnUrl(country.code) }}
        className={className}
        onError={() => setCdnFailed(true)}
      />
    );
  }

  return <Image source={getGlobalFallback()} className={className} />;
};
