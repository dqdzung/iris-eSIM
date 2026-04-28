import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { LinearGradient } from 'expo-linear-gradient';
import { CollapsibleText } from './CollapsibleText';
import termsAndConditions from '@/constants/terms.json';

export const AgreementActionSheet = ({
  visible,
  onClose,
  onAccept,
}: {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setTimeout(() => setIsAnimating(true), 10); // Small delay to trigger animation
    } else setIsAnimating(false);
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
          className={`flex h-[90%] w-full flex-col gap-5 rounded-t-2xl bg-white px-5 py-4 shadow-lg transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <View className="relative w-full flex-row items-center justify-between">
            <View />

            <Text className="px-20 text-center text-[16px] font-semibold leading-6">
              Điều khoản dịch vụ
            </Text>

            <Pressable onPress={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </Pressable>
          </View>

          {/* content */}
          <ScrollView>
            <View className="gap-3 rounded-xl bg-primary/10 p-4">
              <Text className="text-sm">
                Phần Điều khoản dịch vụ này đưa ra các điều khoản điều chỉnh dịch vụ giữa IRIS và
                khách hàng. Bằng việc đăng ký mua SIM du lịch tại IRIS, Quý khách đồng ý rằng các
                Điều khoản dịch vụ này cấu thành hợp đồng hoàn chỉnh giữa Quý khách hàng và IRIS
                (sau đây gọi chung là “Chúng tôi”, “Công ty”).
              </Text>

              <Text className="text-sm font-bold uppercase">
                TRƯỚC KHI NHẤP CHỌN NÚT “THANH TOÁN”, VUI LÒNG ĐỌC KỸ CÁC ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ
                DƯỚI ĐÂY.
              </Text>
            </View>

            <View className="mt-8 gap-3">
              {termsAndConditions.map((term, index) => (
                <CollapsibleText
                  className="rounded-xl bg-primary/10"
                  key={index}
                  title={`${index + 1}. ${term.title}`}
                  content={term.content}
                />
              ))}
            </View>
          </ScrollView>

          {onAccept && (
            <LinearGradient
              className="rounded-xl drop-shadow-md"
              colors={['rgba(58, 89, 237, 1)', 'rgba(125, 68, 225, 1)']}>
              <Pressable onPress={onAccept} className='py-3'>
                <Text className="text-center font-semibold text-white">Đã đọc và đồng ý</Text>
              </Pressable>
            </LinearGradient>
          )}
        </View>
      </View>
    </Modal>
  );
};
