import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { ChevronRight, FileText, Info } from 'lucide-react';

export default function GuideScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: capitalize(t('guide')) }} />

      <ScrollView className="flex-1" contentContainerClassName="gap-6 p-4">
        <Section title={t('guide')} Icon={Info}>
          <Button
            title="eSIM du lịch là gì?"
            onPress={() => router.push('/guide/what-is-esim')}
          />
          <Button
            title="Cách mua eSIM du lịch"
            onPress={() => router.push('/guide/how-to-buy')}
          />
          <Button title="Cách sử dụng eSIM" onPress={() => router.push('/guide/how-to-use')} />
          <Button
            title="Cách kiểm tra dung lượng đã sử dụng"
            onPress={() => router.push('/guide/how-to-check-data')}
          />
        </Section>

        <Section title={t('terms_of_service')} Icon={FileText}>
          <Button
            title="Điều khoản dịch vụ"
            onPress={() => router.push('/guide/terms-of-service')}
          />
          <Button
            title="Chính sách bảo mật"
            onPress={() => router.push('/guide/privacy-policy')}
          />
          <Button
            title="Chính sách thanh toán"
            onPress={() => router.push('/guide/payment-policy')}
          />
          <Button
            title="Chính sách giao hàng"
            onPress={() => router.push('/guide/delivery-policy')}
          />
          <Button
            title="Chính sách trả hàng và hoàn tiền"
            onPress={() => router.push('/guide/refund-policy')}
          />
        </Section>
      </ScrollView>
    </>
  );
}

type IconComponent = React.ComponentType<{ className?: string }>;

const Section = ({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: IconComponent;
  children: React.ReactNode;
}) => (
  <View className="gap-2">
    <View className="flex-row items-center gap-2">
      <View className="h-8 w-8 items-center justify-center rounded-md bg-primary">
        <Icon className="h-5 w-5 stroke-2 text-white" />
      </View>
      <Text className="text-lg font-semibold">{capitalize(title)}</Text>
    </View>
    {children}
  </View>
);

const Button = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between rounded-lg bg-white p-3 drop-shadow-sm">
    <Text className="text-xs">{title}</Text>
    <ChevronRight className="h-4 w-4 stroke-2 text-primary" />
  </Pressable>
);
