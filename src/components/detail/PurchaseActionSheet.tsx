import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { Package } from '@/types';
import { delay, formatVnd } from '@/utils';
import { useRouter } from 'expo-router';
import FormCheckbox from '../checkout/FormCheckbox';
import { CompatibilityActionSheet } from '../CompatibilityActionSheet';
import { ActionSheet } from '../ActionSheet';
import PrimaryButton from '../PrimaryButton';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../checkout/FormInput';
import { Info, Megaphone, Minus, Plus } from 'lucide-react';
import { preparePayment } from '@/api';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

type Form = {
  email: string;
  quantity: number;
  deviceCompatibility: boolean;
};

export const PurchaseActionSheet = ({
  visible,
  onClose,
  selectedPackage,
}: {
  visible: boolean;
  onClose: () => void;
  selectedPackage: Package;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isSheetVisible, setSheetVisible] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      quantity: MIN_QUANTITY,
      deviceCompatibility: true,
    },
    resolver: zodResolver(
      z
        .object({
          email: z.email(t('error.invalid_email')).min(1, t('error.required_field')),
          quantity: z.number(),
          deviceCompatibility: z.boolean(),
        })
        .refine((data) => data.deviceCompatibility === true, {
          message: t('error.device_compatibility_required'),
          path: ['deviceCompatibility'],
        })
    ),
  });

  const quantity = watch('quantity');

  const onSubmit: SubmitHandler<Form> = async (data) => {
    const res = await preparePayment({
      packCode: selectedPackage.packCode,
      email: data.email,
      quantity: data.quantity,
      locationId: selectedPackage.regionId,
    });

    if (!res.success) return;

    onClose();
    router.push({
      pathname: '/result',
      params: { trackingId: res.data?.trackingId || '' },
    });
  };

  const totalCost = useMemo(
    () => selectedPackage.amount * quantity,
    [selectedPackage.amount, quantity]
  );

  const formattedTotal = useMemo(() => formatVnd(totalCost), [totalCost]);

  const handleAdd = () => {
    if (quantity >= MAX_QUANTITY) return;
    setValue('quantity', quantity + 1);
  };

  const handleMinus = () => {
    if (quantity <= MIN_QUANTITY) return;
    setValue('quantity', quantity - 1);
  };

  useEffect(() => {
    if (!visible) reset();
  }, [visible, reset]);

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      overlayClassName="bg-black/30 items-center"
      panelClassName="w-full gap-5 rounded-t-2xl p-4">
      <View className="flex-row items-center gap-3 rounded-xl bg-primary/10 px-3 py-2">
        <Megaphone className="h-6 w-6 -rotate-[30deg] text-primary" />
        <Text className="text-xs text-gray-500">
          Quý khách lấy <Text className="font-semibold text-primary">thông tin eSIM</Text> trong
          email đăng ký nhận hoặc Lịch sử giao dịch
        </Text>
      </View>

      <FormInput
        placeholder="Email"
        fieldName="email"
        control={control}
        error={errors.email}
        autoFocus
      />

      <View className="relative w-full flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-primary">
          {capitalize(t('purchase.quantity'))}
        </Text>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={handleMinus}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/50">
            <Minus className="h-5 w-5 text-white" />
          </Pressable>

          <View className="w-6">
            <Text className="text-center text-xl font-semibold">{quantity}</Text>
          </View>

          <Pressable
            onPress={handleAdd}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Plus className="h-5 w-5 text-white" />
          </Pressable>
        </View>
      </View>

      <FormCheckbox
        label={
          <View className="flex-row items-center gap-2">
            <Text>{t('checkout_form.deviceCompatibility')}</Text>
            <Pressable onPress={() => setSheetVisible(true)}>
              <Info className="h-5 w-5 text-primary" />
            </Pressable>

            {isSheetVisible && (
              <CompatibilityActionSheet
                visible={isSheetVisible}
                onClose={() => setSheetVisible(false)}
              />
            )}
          </View>
        }
        fieldName="deviceCompatibility"
        control={control}
      />

      <View className="flex-row items-center justify-between rounded-xl border-2 border-primary bg-primary/10 p-2.5">
        <View>
          <Text className="text-xs text-gray-500">{capitalize(t('purchase.total_price'))}</Text>
          <Text className="text-center text-xl font-semibold">{formattedTotal}</Text>
        </View>

        <PrimaryButton
          loading={isSubmitting}
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}
          label={capitalize(t('checkout_form.pay'))}
        />
      </View>
    </ActionSheet>
  );
};
