import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { capitalize } from 'lodash';

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
  const { id: countryId } = useLocalSearchParams<{ id: string }>();

  const [isAnimating, setIsAnimating] = useState(false);
  const [amount, setAmount] = useState(1);

  const currentLocale = i18next.language;
  const isEnglish = currentLocale === 'en-US';

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

  const handlePurchase = () => {
    router.push(
      `/checkout?countryId=${countryId}&variantId=${selectedPackage.variant_id}&amount=${amount}&total=${totalCost}`
    );
    onClose();
  };

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
          className={`flex w-full flex-col gap-3 rounded-t-2xl bg-white p-4 shadow-lg transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <View className="flex-row items-center justify-between rounded-xl border-2 border-primary bg-primary/10 p-2.5">
            <View>
              <Text className="text-xs text-gray-500">Tổng tiền</Text>
              <Text className="text-center text-xl font-semibold">{formattedTotal}</Text>
            </View>

            <LinearGradient
              className="rounded-xl px-10 py-3 drop-shadow-md"
              colors={['rgba(58, 89, 237, 1)', 'rgba(125, 68, 225, 1)']}>
              <Pressable onPress={handlePurchase}>
                <Text className="text-center font-semibold text-white">
                  {capitalize(t('buy_now'))}
                </Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};
