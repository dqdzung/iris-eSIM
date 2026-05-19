import NavHeader from '@/components/NavHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { useToast } from '@/components/Toast';
import { ClipboardDocumentIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

const SupportScreen = () => {
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();
  const [value, onChangeText] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleChangeText = (text: string) => {
    if (text.length > 200) return;
    onChangeText(text);
  };

  const handleGoHome = () => {
    router.dismissTo('/');
  };

  const onSubmit = async () => {
    if (submitting) return;
    if (!value.trim()) {
      toast.error(t('toast.support_empty'));
      return;
    }
    setSubmitting(true);
    try {
      // TODO: replace with real support API call
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success(t('toast.support_submitted'));
      onChangeText('');
    } catch {
      toast.error(t('toast.support_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <NavHeader>
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-[16px] font-medium text-white ">Hỗ trợ giao dịch</Text>

          <Pressable onPress={handleGoHome}>
            <HomeIcon className="h-5 w-5 stroke-2 font-bold text-white" />
          </Pressable>
        </View>
      </NavHeader>

      <View className="flex-1 items-center p-4">
        <View className="mt-5 w-full items-center gap-2">
          <View className="absolute -top-5 z-10 h-10 w-10 items-center justify-center rounded-full bg-primary">
            <ClipboardDocumentIcon className="h-5 w-5 stroke-2 text-white" />
          </View>

          <View className="w-full rounded-lg bg-white p-4 text-gray-400">
            <View className="flex-row justify-between pb-4">
              <Text className="text-inherit">Mã giao dịch</Text>
              <Text className="text-inherit">EW3E911444e</Text>
            </View>
            <View className="flex-row justify-between border-b-2 border-t-2 border-gray-100/50 py-4">
              <Text className="text-inherit">Thời gian</Text>
              <Text className="text-inherit">{new Date().toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between pt-4">
              <Text className="text-inherit">Email</Text>
              <Text className="text-inherit">user@example.com</Text>
            </View>
          </View>

          <View className="w-full flex-row justify-between rounded-lg bg-white p-4 text-gray-400">
            <Text className="text-inherit">SĐT liên hệ</Text>
            <Text className="text-black">0123456789</Text>
          </View>

          <View className="w-full justify-between gap-1 rounded-lg bg-white p-4 text-gray-400">
            <Text className="text-inherit">Nội dung</Text>

            <TextInput
              className="text-black outline-none"
              autoFocus
              multiline
              numberOfLines={5}
              maxLength={MAX_CONTENT_LENGTH}
              onChangeText={handleChangeText}
              value={value}
            />

            <Text className="text-right text-[10px] text-gray-400">
              {value.length}/{MAX_CONTENT_LENGTH}
            </Text>
          </View>

          <PrimaryButton
            onPress={onSubmit}
            disabled={submitting}
            className="mt-5 w-full rounded-xl drop-shadow-md"
            pressableClassName="py-3"
            label="Gửi yêu cầu"
          />
        </View>
      </View>
    </View>
  );
};

export default SupportScreen;

const MAX_CONTENT_LENGTH = 200;
