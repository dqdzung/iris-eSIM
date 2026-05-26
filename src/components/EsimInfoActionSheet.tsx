import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { BookOpenIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'expo-router';
import { ActionSheet } from './ActionSheet';

export const EsimInfoActionSheet = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleClickGuide = () => {
    router.push(`/guide`);
  };

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      overlayClassName="bg-black/30 items-center"
      panelClassName="w-full flex-col gap-5 rounded-t-2xl px-5 py-4"
      footer={
        <View className="w-full bg-gray-100 p-3">
          <View className="flex-row items-center justify-between gap-2 rounded-lg bg-white p-3 drop-shadow-sm">
            <View className="flex-row items-center gap-2">
              <BookOpenIcon className="h-6 w-6 stroke-2 text-primary" />
              <Text className="text-[10px] font-semibold capitalize text-primary">
                {t('home_screen.detailed_guide')}
              </Text>
            </View>

            <Pressable
              onPress={handleClickGuide}
              className="flex-row items-center gap-1 rounded-full border border-primary px-3 py-0.5">
              <Text className="text-[10px] font-semibold capitalize text-primary">
                {t('home_screen.view_guide')}
              </Text>
              <ChevronRightIcon className="h-5 w-5 stroke-2 text-primary" />
            </Pressable>
          </View>
        </View>
      }>
      <View className="relative w-full flex-row items-center justify-between">
        <Text className="text-[16px] font-semibold leading-6">
          {capitalize(t('esim_info_sheet.title'))}
        </Text>

        <Pressable onPress={onClose}>
          <ChevronDownIcon className="h-5 w-5" />
        </Pressable>
      </View>

      <View className="gap-5">
        <Text className="">
          {capitalize(t('esim_info_sheet.email_notice_prefix'))}{' '}
          <Text className="font-semibold text-primary">
            {capitalize(t('esim_info_sheet.email_label'))}
          </Text>
        </Text>
      </View>
    </ActionSheet>
  );
};
