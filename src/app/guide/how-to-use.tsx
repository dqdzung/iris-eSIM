import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CollapsibleCard } from '@/components/CollapsibleCard';

type Platform = 'ios' | 'android';

type CardData = { title: string; steps: string[] };

export default function HowToUseScreen() {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<Platform>('ios');

  const title = t('guide_screen.topics.how-to-use.title');

  return (
    <>
      <Stack.Screen options={{ title }} />
      <View className="flex-1">
        <View className="flex-row justify-center gap-2 px-4">
          {(['ios', 'android'] as Platform[]).map((p) => (
            <View key={p} className="flex-1">
              <Text
                onPress={() => setPlatform(p)}
                className={`px-4 py-3 text-center ${
                  platform === p ? 'font-semibold text-primary' : 'text-gray-400'
                }`}>
                {p === 'ios' ? 'Cài đặt iOS' : 'Cài đặt Android'}
              </Text>
              <View className={`h-1 rounded-t-lg ${platform === p ? 'bg-primary' : ''}`} />
            </View>
          ))}
        </View>

        <ScrollView className="flex-1" contentContainerClassName="gap-3 p-4">
          <View key={platform} className="gap-3">
            {CARDS[platform].map((card) => (
              <CollapsibleCard key={card.title} title={card.title}>
                {card.steps.map((step, i) => (
                  <Text key={i} className="text-xs">
                    {step}
                  </Text>
                ))}
              </CollapsibleCard>
            ))}
          </View>

          <Text className="rounded-xl bg-gray-200 p-3 text-[11px]">{TIP}</Text>
        </ScrollView>
      </View>
    </>
  );
}

const CARDS: Record<Platform, CardData[]> = {
  ios: [
    {
      title: 'Cài đặt từ chính thiết bị',
      steps: [
        'Bước 1: Chụp ảnh màn hình chứa mã QR eSIM',
        'Bước 2: Vào Settings > Camera > Bật "Quét mã QR"',
        'Bước 3: Mở Camera > Chọn ảnh chup màn hình > Ấn icon quét QR ở góc dưới phải > Chọn Thêm eSIM',
      ],
    },
    {
      title: 'Cài đặt qua mã QR trên thiết bị khác',
      steps: [
        'Bước 1: Bật 4G/Wifi > Settings > Cellular > Add eSIM > Use QR code',
        'Bước 2: Quét mã QR được mở trên thiết bị khác hoặc in ra',
        'Bước 3: Tại màn Activate eSIM, chọn Continue',
        'Bước 4: Tại màn Cellular Setup Complete, chọn Done',
      ],
    },
    {
      title: 'Cài đặt qua nhập mã thủ công',
      steps: [
        'Bước 1: Bật 4G/Wifi > Settings > Cellular > Add eSIM > Enter Details Manually',
        'Bước 2: Nhập địa chỉ SM-DP+ và Mã kích hoạt (từ email eSIM)',
        'Bước 3: Tại màn Activate eSIM, chọn Continue',
        'Bước 4: Tại màn Cellular Setup Complete',
      ],
    },
  ],
  android: [
    {
      title: 'Cài đặt qua mã QR',
      steps: [
        'Bước 1: Bật 4G/Wifi > Settings > Connections > SIM Manager',
        'Bước 2: Chọn Add eSIM > Quét mã QR',
        'Bước 3: Đưa mã QR vào khung quét > Nhấn Add và đợi vài phút',
        'Bước 4: Tại màn Cellular Setup Complete, chọn Done',
      ],
    },
    {
      title: 'Cài đặt qua nhập mã thủ công',
      steps: [
        'Bước 1: Bật 4G/Wifi > Settings > Connections > SIM Manager',
        'Bước 2: Chọn Add eSIM > Quét mã QR',
        'Bước 3: Tại khung quét, chọn Enter activation code',
        'Bước 4: Nhập thông tin eSIM > Bấm Done',
        'Bước 5: Khi được hỏi Add eSIM > Bấm Add và đợi vài phút',
      ],
    },
  ],
};

const TIP =
  'Mẹo: In mã QR ra giấy hoặc ghi lại thông tin mã kích hoạt để nhập thủ công nếu bạn chỉ có một điện thoại. Bạn có thể sử dụng thiết bị khác để chụp ảnh mã QR và quét. Đặc biệt, với iOS 17 cho phép bạn có thể quét mã QR code trực tiếp từ Album ảnh.';
