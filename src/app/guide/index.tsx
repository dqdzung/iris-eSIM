import { ChevronRightIcon, DocumentIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Stack } from 'expo-router';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function GuideScreen() {
  const { t } = useTranslation();
  return (
    <ScrollView className="flex-1 p-4">
      <Stack.Screen options={{ title: capitalize(t('guide')) }} />
      <View className="gap-6">
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-md bg-primary">
              <InformationCircleIcon className="h-6 w-6 text-white" />
            </View>
            <Text className="text-lg font-semibold capitalize">{t('guide')}</Text>
          </View>

          <Button title="eSIM du lịch là gì?" />
          <Button title="Cách mua eSIM du lịch" />
          <Button title="Hướng dẫn thêm eSIM vào máy" />
          <Button title="Cách sử dụng eSIM" />
          <Button title="Cách kiểm tra dung lượng đã sử dụng" />
        </View>

        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-md bg-primary">
              <DocumentIcon className="h-5 w-5 text-white" />
            </View>
            <Text className="text-lg font-semibold capitalize">{t('terms_of_service')}</Text>
          </View>

          <Button title="Điều khoản dịch vụ" />
          <Button title="Chính sách bảo mật" />
          <Button title="Chính sách thanh toán" />
          <Button title="Chính sách giao hàng" />
          <Button title="Chính sách trả hàng và hoàn tiền" />
        </View>
      </View>
    </ScrollView>
  );
}

const Button = ({ title }: { title: string }) => {
  return (
    <Pressable className="flex-row justify-between rounded-lg bg-white p-3 drop-shadow-sm">
      <Text className="text-xs">{title}</Text>

      <ChevronRightIcon className="h-4 w-4 stroke-2 text-primary" />
    </Pressable>
  );
};

export { Button };
