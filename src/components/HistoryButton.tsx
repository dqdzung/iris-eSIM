import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const HistoryButton = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/history')}
      className="flex-row items-center gap-2">
      <Text className="font-semibold text-white">{capitalize(t('nav.history'))}</Text>
      <ArrowPathIcon className="h-5 w-5 stroke-2 text-white" />
    </Pressable>
  );
};

export default HistoryButton;
