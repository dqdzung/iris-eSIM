import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { History } from 'lucide-react';

const HistoryButton = ({ showLabel = true }: { showLabel?: boolean }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('/history')} className="flex-row items-center gap-2">
      {showLabel && (
        <Text className="font-semibold text-white">{capitalize(t('nav.history'))}</Text>
      )}
      <History className="h-5 w-5 stroke-2 text-white" />
    </Pressable>
  );
};

export default HistoryButton;
