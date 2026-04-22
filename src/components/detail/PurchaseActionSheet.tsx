import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { InformationCircleIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FormCheckbox from '../checkout/FormCheckbox';
import { CompatibilityActionSheet } from '../CompatibilityActionSheet';
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
  selectedPackage: any;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  // const { id: countryId } = useLocalSearchParams<{ id: string }>();

  const [isAnimating, setIsAnimating] = useState(false);
  const [amount, setAmount] = useState(1);
  const [isSheetVisible, setSheetVisible] = useState(false);

  const currentLocale = i18next.language;
  const isEnglish = currentLocale === 'en-US';

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
    console.log(data);
    router.push({
      pathname: '/result',
      params: { success: Math.random() >= 0.5 ? 'true' : 'false' }, // Simulate success or failure randomly
    });
    onClose();
  };

  const packagePrice = useMemo(() => {
    const price: number = isEnglish
      ? selectedPackage.selling_price_usd
      : selectedPackage.selling_price;
    return price;
  }, [isEnglish, selectedPackage.selling_price, selectedPackage.selling_price_usd]);

  const totalCost = useMemo(() => {
    return packagePrice * amount;
  }, [packagePrice, amount]);

  const formattedTotal = useMemo(() => {
    return totalCost.toLocaleString(currentLocale, {
      style: 'currency',
      currency: isEnglish ? 'USD' : 'VND',
    });
  }, [currentLocale, isEnglish, totalCost]);

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
    if (visible) {
      // Small delay to trigger animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setAmount(1);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* opaque overlay */}
      <View
        className={`flex-1 items-center bg-black/30 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
        {/* touch overlay to close */}
        <TouchableOpacity onPress={onClose} className="w-full flex-1" />
        {/* modal */}
        <View
          className={`flex w-full flex-col gap-5 rounded-t-2xl bg-white p-4 shadow-lg transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <FormInput
            placeholder="Email"
            fieldName="email"
            control={control}
            error={errors.email}
            required={false}
            autoFocus
          />

          <View className="relative w-full flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-primary">Số lượng</Text>
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

            {/* <Pressable onPress={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </Pressable> */}
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
              <Text className="text-xs text-gray-500">Tổng tiền</Text>
              <Text className="text-center text-xl font-semibold">{formattedTotal}</Text>
            </View>

            <LinearGradient
              className="rounded-xl drop-shadow-md"
              colors={
                isValid
                  ? ['rgba(58, 89, 237, 1)', 'rgba(125, 68, 225, 1)']
                  : ['rgba(200, 200, 200, 1)', 'rgba(170, 170, 170, 1)']
              }>
              <Pressable
                className="px-10 py-3"
                disabled={!isValid}
                onPress={handleSubmit(onSubmit)}>
                <Text className="text-center font-semibold text-white">Thanh toán</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};
