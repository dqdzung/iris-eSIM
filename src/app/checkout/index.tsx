import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutForm, createCheckoutSchema } from '@/components/checkout/form';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { fetchCountryData } from '@/api';
import { CountryData } from '@/types';
import FormCheckbox from '@/components/checkout/FormCheckbox';
import FormInput from '@/components/checkout/FormInput';
import FormRadioGroup from '@/components/checkout/FormRadioGroup';
import { formatCurrency } from '@/utils';
import {
  CreditCardIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';

export default function Checkout() {
  const { i18n, t } = useTranslation();

  const { countryId, variantId, amount, total } = useLocalSearchParams<{
    countryId?: string;
    variantId?: string;
    amount?: string;
    total?: string;
  }>();

  const parsedCountryId = countryId ? parseInt(countryId) : 0;
  const parsedVariantId = variantId ? parseInt(variantId) : 0;
  const parsedAmount = amount ? parseInt(amount) : 0;
  const parsedTotal = total ? parseInt(total) : 0;
  const isEnglish = i18n.language === 'en-US';
  const formattedTotal = formatCurrency(parsedTotal, i18n.language, isEnglish ? 'USD' : 'VND');

  const [data, setData] = useState<CountryData>();

  const packageData = useMemo(() => {
    // filter with country id
    return data?.packages.find((e) => e.variant_id === parsedVariantId);
  }, [data?.packages, parsedVariantId]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      emailConfirm: '',
      deviceCompatibility: false,
      saveInfo: false,
      receipt: false,
      paymentMethod: 'qr',
      discountCode: '',
      termAndCondition: false,
      shareInfoAgreement: false,
    },
    resolver: zodResolver(createCheckoutSchema(t)),
  });

  const onSubmit: SubmitHandler<CheckoutForm> = (data: CheckoutForm) => {
    console.log(data);
  };

  useEffect(() => {
    if (countryId) {
      fetchCountryData(countryId).then(setData);
    }
  }, [countryId]);

  return (
    <ScrollView contentContainerClassName="p-4 mb-5">
      <Stack.Screen options={{ title: capitalize(t('checkout_form.title')) }} />

      <View className="h-full flex-col gap-8">
        <View className="flex-col gap-3">
          <Text className="mb-2 text-lg font-bold text-primary">
            {capitalize(t('checkout_form.purchase_info'))}
          </Text>

          {['name', 'phone', 'email', 'emailConfirm'].map((e, index) => {
            return (
              <FormInput
                key={index}
                label={capitalize(t(`checkout_form.${e}`))}
                fieldName={e}
                control={control}
                error={(errors as any)[e]}
              />
            );
          })}

          <View className="mt-5 flex-col gap-3">
            {['deviceCompatibility', 'saveInfo', 'receipt'].map((e, index) => (
              <FormCheckbox
                key={index}
                label={t(`checkout_form.${e}`)}
                fieldName={e}
                control={control}
              />
            ))}
          </View>
        </View>

        <Divider />

        <View className="flex-col gap-3">
          <Text className="mb-2 text-lg font-bold text-primary">
            {capitalize(t('checkout_form.order_info'))}
          </Text>

          <View className="flex-row items-end justify-between">
            <View className="flex-col gap-2">
              <Text className="text-[14px] font-semibold">eSIM {packageData?.name_vi}</Text>

              <View className="flex-row items-center gap-1.5">
                <Text className="text-[12px] text-gray-500">
                  {packageData?.type === 'UNLIMITED'
                    ? capitalize(t('unlimited'))
                    : `${packageData?.data_amount}${packageData?.data_unit}${packageData?.type === 'DAILY' ? t('per_day') : ''}`}
                </Text>
                <Text className="text-gray-500">-</Text>
                <Text className="text-[12px] text-gray-500">{`${packageData?.validity_days} ${t('day')}`}</Text>
                <DotDivider />
                <Text className="text-[12px] text-gray-500">{`x${parsedAmount}`}</Text>
                <DotDivider />
                <Text className="rounded-full bg-orange-500 px-3 py-0.5 text-xs capitalize text-white">
                  tiktok
                </Text>
              </View>
            </View>
            <Text className="font-bold">{formattedTotal}</Text>
          </View>
        </View>

        <Divider />

        <View className="flex-col gap-3">
          <Text className="mb-2 text-lg font-bold text-primary">
            {capitalize(t('checkout_form.payment_method'))}
          </Text>

          <FormRadioGroup
            fieldName="paymentMethod"
            control={control}
            error={errors.paymentMethod}
            required
            options={[
              {
                label: (
                  <View className="ml-1 flex-row items-center gap-2">
                    <QrCodeIcon className="h-5 w-5" />
                    <Text>{capitalize(t('checkout_form.qr'))}</Text>
                  </View>
                ),
                value: 'qr',
              },
              {
                label: (
                  <View className="ml-1 flex-row items-center gap-2">
                    <DevicePhoneMobileIcon className="h-5 w-5" />
                    <Text>{capitalize(t('checkout_form.mobile'))}</Text>
                  </View>
                ),
                value: 'mobile',
              },
              {
                label: (
                  <View className="ml-1 flex-row items-center gap-2">
                    <CreditCardIcon className="h-5 w-5" />
                    <Text>{capitalize(t('checkout_form.atm'))}</Text>
                  </View>
                ),
                value: 'atm',
              },
              {
                label: (
                  <View className="ml-1 flex-row items-center gap-2">
                    <WalletIcon className="h-5 w-5" />
                    <Text>{capitalize(t('checkout_form.wallet'))}</Text>
                  </View>
                ),
                value: 'wallet',
              },
            ]}
          />
        </View>

        <View className="flex-col rounded-lg bg-white px-3 py-4 drop-shadow-md">
          <Text className="text-lg font-semibold">Tổng quan</Text>

          <View className="mt-3 flex-row items-center gap-2 rounded-lg bg-gray-200 px-1">
            <FormInput
              required={false}
              fieldName={'discountCode'}
              control={control}
              error={errors.discountCode}
              placeholder="Mã giảm giá"
            />
            <Pressable className="rounded-lg bg-primary p-3">
              <Text className="text-white">Chọn mã</Text>
            </Pressable>
          </View>

          <Text className="mt-6 font-semibold">Chi tiết thanh toán</Text>
          <View className="mt-3 flex-col gap-3">
            <View className="flex-1 flex-row justify-between">
              <Text className="text-gray-400">Tạm tính</Text>
              <Text className="font-semibold">{formattedTotal}</Text>
            </View>
            <View className="flex-1 flex-row justify-between">
              <Text className="text-gray-400">Giảm giá</Text>
              <Text className="font-semibold text-primary">
                -{formatCurrency(discountAmount, i18n.language, isEnglish ? 'USD' : 'VND')}
              </Text>
            </View>
            <View className="flex-1 flex-row justify-between">
              <Text className="text-gray-400">Voucher</Text>
              <Text className="font-semibold text-primary">
                -{formatCurrency(voucherAmount, i18n.language, isEnglish ? 'USD' : 'VND')}
              </Text>
            </View>

            <View className="flex-1 flex-row items-center justify-between border-t border-gray-200 pt-4">
              <Text className="text-lg font-bold">Tổng</Text>
              <Text className="text-lg font-bold">
                {formatCurrency(
                  parsedTotal - discountAmount - voucherAmount,
                  i18n.language,
                  isEnglish ? 'USD' : 'VND'
                )}
              </Text>
            </View>
          </View>

          <View className="mt-6 flex-col gap-3">
            <View className="flex-row items-center">
              <FormCheckbox fieldName={'termAndCondition'} control={control} />
              <Text className="text-xs text-gray-500">
                Tôi đồng ý với{' '}
                <Text className="font-semibold text-primary underline">
                  Điều kiện và điều khoản
                </Text>
              </Text>
            </View>
            <View className="flex-row items-center">
              <FormCheckbox fieldName={'shareInfoAgreement'} control={control} />
              <Text className="text-xs text-gray-500">
                Tôi đồng ý với{' '}
                <Text className="font-semibold text-primary underline">chia sẻ thông tin</Text> cho
                IRIS
              </Text>
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="mt-4 h-10 items-center justify-center rounded-lg bg-primary">
              <Text className="font-semibold text-white">{capitalize(t('checkout_form.pay'))}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const Divider = () => <View className="h-1.5 bg-gray-200" />;
const DotDivider = () => <Text className="font-bold text-gray-500">•</Text>;
const discountAmount = 3000;
const voucherAmount = 3000;
