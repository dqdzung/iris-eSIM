import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { ScrollView, Text, View } from 'react-native';

// Map of topic slug → i18n key bases. Each topic must have two i18n keys:
// `guide.topics.<slug>.title` and `guide.topics.<slug>.body`.
// If a topic needs custom layout (images, interactive content), create a
// static file at /guide/<slug>.tsx; that file will take precedence over
// this dynamic route automatically.
const TOPICS = new Set<string>([
  'what-is-esim',
  'how-to-buy',
  'how-to-check-data',
  'terms-of-service',
  'privacy-policy',
  'payment-policy',
  'delivery-policy',
  'refund-policy',
]);

export default function GuideTopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { t } = useTranslation();

  if (!topicId || !TOPICS.has(topicId)) {
    return (
      <>
        <Stack.Screen options={{ title: capitalize(t('guide')) }} />
        <ScrollView className="flex-1" contentContainerClassName="gap-3 p-4">
          <Text className="text-center text-gray-500">{capitalize(t('no_result'))}</Text>
        </ScrollView>
      </>
    );
  }

  const title = t(`guide_screen.topics.${topicId}.title`);
  const body = t(`guide_screen.topics.${topicId}.body`);
  const paragraphs = body.split('\n\n').filter(Boolean);

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="gap-3 rounded-xl bg-white p-4 drop-shadow-sm">
          {paragraphs.map((p, i) => (
            <Text key={i} className="text-sm">
              {p}
            </Text>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
