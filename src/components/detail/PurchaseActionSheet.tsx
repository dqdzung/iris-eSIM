import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { Package } from '@/types';
import { formatVnd } from '@/utils';
import { InformationCircleIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'expo-router';
import FormCheckbox from '../checkout/FormCheckbox';
import { CompatibilityActionSheet } from '../CompatibilityActionSheet';
import { ActionSheet } from '../ActionSheet';
import PrimaryButton from '../PrimaryButton';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../checkout/FormInput';

type Form = {
  email: string;
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
  // const { id: countryId } = useLocalSearchParams<{ id: string }>();

  const [amount, setAmount] = useState(1);
  const [isSheetVisible, setSheetVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      deviceCompatibility: true,
    },
    resolver: zodResolver(
      z
        .object({
          // Allows an empty string or a valid email string.
          // If the field is left blank (empty string), it passes validation.
          email: z.union([z.literal(''), z.email(t('error.invalid_email'))]),
          deviceCompatibility: z.boolean(),
        })
        .refine((data) => data.deviceCompatibility === true, {
          message: t('error.device_compatibility_required'),
          path: ['deviceCompatibility'],
        })
    ),
  });

  const onSubmit: SubmitHandler<Form> = (data: Form) => {
    // console.log(data);

    // TODO: handle checkout logic

    router.push({
      pathname: '/result',
      params: { success: Math.random() >= 0.5 ? 'true' : 'false' }, // Simulate success or failure randomly
    });
    onClose();
  };

  const totalCost = useMemo(
    () => selectedPackage.amount * amount,
    [selectedPackage.amount, amount]
  );

  const formattedTotal = useMemo(() => formatVnd(totalCost), [totalCost]);

  const handleAdd = () => {
    if (amount >= 10) return;
    setAmount((prev) => prev + 1);
  };

  const handleMinus = () => {
    if (amount <= 1) return;
    setAmount((prev) => prev - 1);
  };

  // const handlePurchase = () => {
  //   router.push(
  //     `/checkout?countryId=${countryId}&variantId=${selectedPackage.variant_id}&amount=${amount}&total=${totalCost}`
  //   );
  //   onClose();
  // };

  useEffect(() => {
    if (!visible) setAmount(1);
  }, [visible]);

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      overlayClassName="bg-black/30 items-center"
      panelClassName="w-full gap-5 rounded-t-2xl p-4">
      <FormInput
        placeholder="Email"
        fieldName="email"
        control={control}
        error={errors.email}
        required={false}
        autoFocus
      />

      <View className="relative w-full flex-row items-center justify-between">
        <Text className="text-lg font-semibold capitalize text-primary">
          {t('purchase.quantity')}
        </Text>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={handleMinus}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/50">
            <MinusIcon className="h-5 w-5 text-white" />
          </Pressable>

          <View className="w-6">
            <Text className="text-center text-xl font-semibold">{amount}</Text>
          </View>

          <Pressable
            onPress={handleAdd}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <PlusIcon className="h-5 w-5 text-white" />
          </Pressable>
        </View>
      </View>

      <FormCheckbox
        label={
          <View className="flex-row items-center gap-1">
            <Text>{t('checkout_form.deviceCompatibility')}</Text>
            <Pressable onPress={() => setSheetVisible(true)}>
              <InformationCircleIcon className="h-6 w-6 text-primary" />
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
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}
          label={capitalize(t('checkout_form.pay'))}
        />
      </View>
    </ActionSheet>
  );
};
