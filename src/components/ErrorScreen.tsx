import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import failureImg from '@assets/failure.png';
import PrimaryButton from './PrimaryButton';
import {capitalize} from 'lodash';

type Props = {
  onReload?: () => void;
};

const defaultReload = () => {
  if (typeof window !== 'undefined') window.location.reload();
};

export const ErrorScreen = ({ onReload = defaultReload }: Props) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center gap-5 p-6">
      <Image source={failureImg} className="h-[200px] w-full" contentFit="contain" />
      <View className="gap-2">
        <Text className="text-center text-xl font-bold text-primary">
          {t('error_screen.title')}
        </Text>
        <Text className="text-center">{t('error_screen.body')}</Text>
      </View>
      <PrimaryButton
        onPress={onReload}
        pressableClassName="px-8 py-3"
        label={capitalize(t('reload'))}
      />
    </View>
  );
};
