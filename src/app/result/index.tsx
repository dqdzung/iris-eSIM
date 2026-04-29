import { ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import successImg from '@assets/success.png';
import failureImg from '@assets/failure.png';

const ResultScreen = () => {
  const router = useRouter();
  const { success: successParam } = useLocalSearchParams<{ success: string }>();
  const isPaymentSuccessful = successParam === 'true';

  const handleClick = () => {
    if (isPaymentSuccessful) {
      // TODO: Navigate to transaction details page or show details
    } else
      // Navigate back to the previous screen or home
      router.back();
  };

  const handleClickSupport = () => router.push('/support');

  const imgPath = isPaymentSuccessful ? successImg : failureImg;

  return (
    <View className="flex-1 gap-3 p-4">
      <Stack.Screen options={{ title: 'Kết quả giao dịch' }} />
      <View className="flex-1 items-center justify-center gap-5">
        <Image source={imgPath} className="h-[200px] w-full" contentFit="contain" />
        <View className="gap-2">
          <Text className="text-center text-xl font-bold text-primary">
            {isPaymentSuccessful ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
          </Text>
          <Text className="text-center">
            {isPaymentSuccessful
              ? 'Chúc mừng Quý khách đã thanh toán thành công'
              : 'Vui lòng kiểm tra lại thông tin đang ký hoặc chờ đợi tín hiệu mạng ổn định lại.'}
          </Text>
        </View>
      </View>
      <LinearGradient
        className="rounded-xl drop-shadow-md"
        colors={['rgba(58, 89, 237, 1)', 'rgba(125, 68, 225, 1)']}>
        <Pressable className="py-3" onPress={handleClick}>
          <Text className="text-center font-semibold text-white">
            {isPaymentSuccessful ? 'Chi tiết giao dịch' : 'Quay lại'}
          </Text>
        </Pressable>
      </LinearGradient>

      <Pressable
        onPress={handleClickSupport}
        className="flex-row items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 drop-shadow-sm">
        <View className="flex-row items-center gap-2">
          <QuestionMarkCircleIcon className="h-6 w-6 stroke-2 text-primary" />
          <Text className="text-[10px] font-semibold text-primary">Yêu cầu hỗ trợ</Text>
        </View>

        <ChevronRightIcon className="h-5 w-5 stroke-2 text-primary" />
      </Pressable>
    </View>
  );
};

export default ResultScreen;
