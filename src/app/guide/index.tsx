import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Stack } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function GuideScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <Stack.Screen options={{ title: 'Hướng dẫn' }} />
      <View className="gap-2">
        <View className="mb-2 flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-md bg-primary">
            <InformationCircleIcon className="h-6 w-6 text-white" />
          </View>
          <Text className="text-lg font-semibold">Hướng dẫn</Text>
        </View>

        <Button title="eSIM du lịch là gì?" />
        <Button title="Cách mua eSIM du lịch" />
        <Button title="Hướng dẫn thêm eSIM vào máy" />
        <Button title="Cách sử dụng eSIM" />
        <Button title="Cách kiểm tra dung lượng đã sử dụng" />
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
