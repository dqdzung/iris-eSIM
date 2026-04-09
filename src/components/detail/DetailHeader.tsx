import { View, Text, Pressable } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import CompatibilityButton from '../CompatibilityButton';

interface DetailHeaderProps {
  banner: string;
  flag: string;
  lowestPrice: string;
  highestPrice: string;
  carriers: string;
  coverage: string;
}

const DetailHeader = ({
  banner,
  flag,
  lowestPrice,
  highestPrice,
  carriers,
  coverage,
}: DetailHeaderProps) => {
  const { t } = useTranslation();

  return (
    <ImageBackground source={banner || ''} className="rounded-xl">
      <View className="gap-6 rounded-xl bg-black/45 p-3">
        <View className="flex-row items-center justify-between">
          <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-100">
            <Image source={flag} className="h-full w-full" />
          </View>

          <CompatibilityButton />
        </View>

        <Text className="text-[24px] text-white">
          {lowestPrice} - {highestPrice}
        </Text>

        <View className="flex-row items-end justify-between gap-2">
          <View className="flex-col gap-1">
            {[
              { key: 'carrier', value: carriers },
              { key: 'coverage', value: coverage },
              { key: 'activation', value: '' },
            ].map(({ key, value }: { key: string; value: string }) => (
              <Text key={key} className="text-white">
                {capitalize(t(key))}: {value}
              </Text>
            ))}
          </View>

          <Pressable>
            <InformationCircleIcon className="h-7 w-7 text-white hover:text-white/90" />
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default DetailHeader;
