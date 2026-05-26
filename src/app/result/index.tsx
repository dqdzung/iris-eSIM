import {
  BookOpenIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import successImg from '@assets/success.png';
import failureImg from '@assets/failure.png';
import NavHeader from '@/components/NavHeader';
import PrimaryButton from '@/components/PrimaryButton';

const ResultScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
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
  const handleClickHowToUse = () => router.push('/guide/how-to-use');

  const imgPath = isPaymentSuccessful ? successImg : failureImg;

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <NavHeader>
        <Text className="text-[16px] font-semibold text-white ">
          {capitalize(t('nav.transaction_result'))}
        </Text>
      </NavHeader>

      <View className="flex-1 gap-3 p-4">
        <View className="flex-1 items-center justify-center gap-5">
          <Image source={imgPath} className="h-[200px] w-full" contentFit="contain" />
          <View className="gap-2">
            <Text className="text-center text-xl font-bold text-primary">
              {t(isPaymentSuccessful ? 'result_screen.success_title' : 'result_screen.fail_title')}
            </Text>
            <Text className="text-center">
              {t(isPaymentSuccessful ? 'result_screen.success_body' : 'result_screen.fail_body')}
            </Text>
          </View>
        </View>

        <PrimaryButton
          onPress={handleClick}
          pressableClassName="py-3"
          label={capitalize(
            t(isPaymentSuccessful ? 'result_screen.transaction_detail' : 'result_screen.go_back')
          )}
        />

        {isPaymentSuccessful ? (
          <Pressable
            onPress={handleClickHowToUse}
            className="flex-row items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 drop-shadow-sm">
            <View className="flex-row items-center gap-2">
              <BookOpenIcon className="h-6 w-6 stroke-2 text-primary" />
              <Text className="text-[10px] font-semibold capitalize text-primary">
                {t('guide_screen.topics.how-to-use.title')}
              </Text>
            </View>

            <ChevronRightIcon className="h-5 w-5 stroke-2 text-primary" />
          </Pressable>
        ) : null}

        <Pressable
          onPress={handleClickSupport}
          className="flex-row items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 drop-shadow-sm">
          <View className="flex-row items-center gap-2">
            <QuestionMarkCircleIcon className="h-6 w-6 stroke-2 text-primary" />
            <Text className="text-[10px] font-semibold capitalize text-primary">
              {t('result_screen.support_request')}
            </Text>
          </View>

          <ChevronRightIcon className="h-5 w-5 stroke-2 text-primary" />
        </Pressable>
      </View>
    </View>
  );
};

export default ResultScreen;
