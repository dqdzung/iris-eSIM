import { capitalize } from 'lodash';
import { useRouter } from 'expo-router';
import { BookMarked, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Pressable, View, Text } from 'react-native';

export default function GuideButton({ onClick }: { onClick?: () => void }) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleClickGuide = () => {
    onClick?.();
    router.push('/guide');
  };

  return (
    <View className="flex-row items-center justify-between gap-2 rounded-lg bg-white p-3 drop-shadow-sm">
      <View className="flex-row items-center gap-2">
        <BookMarked className="h-6 w-6 stroke-2 text-primary" />
        <Text className="text-xxs font-semibold text-primary">
          {capitalize(t('home_screen.detailed_guide'))}
        </Text>
      </View>

      <Pressable
        onPress={handleClickGuide}
        className="flex-row items-center gap-1 rounded-full border border-primary py-0.5 pl-2.5 pr-1">
        <Text className="text-xxs font-semibold text-primary">
          {capitalize(t('home_screen.view_guide'))}
        </Text>
        <ChevronRight className="h-4 w-4 text-primary" />
      </Pressable>
    </View>
  );
}
