import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { ActionSheet } from './ActionSheet';
import { CollapsibleText } from './CollapsibleText';
import PrimaryButton from './PrimaryButton';
import termsAndConditions from '@/constants/terms.json';
import { X } from 'lucide-react';

export const AgreementActionSheet = ({
  visible,
  onClose,
  onAccept,
}: {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      overlayClassName="bg-black/30 items-center"
      panelClassName="h-[90%] w-full gap-5 rounded-t-2xl px-5 py-4">
      <View className="relative w-full flex-row items-center justify-between">
        <View />

        <Text className="px-20 text-center text-base font-semibold leading-6">
          {capitalize(t('terms_of_service'))}
        </Text>

        <Pressable onPress={onClose}>
          <X className="h-6 w-6" />
        </Pressable>
      </View>

      <ScrollView>
        <View className="gap-3 rounded-xl bg-primary/10 p-4">
          <Text className="text-sm">
            Phần Điều khoản dịch vụ này đưa ra các điều khoản điều chỉnh dịch vụ giữa IRIS và khách
            hàng. Bằng việc đăng ký mua SIM du lịch tại IRIS, Quý khách đồng ý rằng các Điều khoản
            dịch vụ này cấu thành hợp đồng hoàn chỉnh giữa Quý khách hàng và IRIS (sau đây gọi
            chung là “Chúng tôi”, “Công ty”).
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
        <PrimaryButton onPress={onAccept} pressableClassName="py-3" label={t('agreement_accept')} />
      )}
    </ActionSheet>
  );
};
