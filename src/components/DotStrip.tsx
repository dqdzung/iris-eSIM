import { Image } from 'expo-image';
import dotStrip from '@assets/dotStrip.svg';

const DotStrip = () => (
  <Image source={dotStrip} className="h-[21px] w-[98px]" contentFit="contain" />
);

export default DotStrip;
