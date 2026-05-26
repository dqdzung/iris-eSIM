import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { BookOpenIcon, ChevronDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { TransactionResultItem } from '@/types';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { formatDateTime } from '@/utils';
import { ActionSheet } from './ActionSheet';
import { FlagImage } from './FlagImage';

type Props = {
  visible: boolean;
  onClose: () => void;
  items: TransactionResultItem[];
  createDate?: string;
};

export const EsimInfoActionSheet = ({ visible, onClose, items, createDate }: Props) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { countryAndRegion } = useGlobalDataContext();
  const isEnglish = i18n.language === 'en-US';

  const [expandedItemIdx, setExpandedItemIdx] = useState<number | null>(null);

  const countryByName = useMemo(() => {
    const map = new Map<string, (typeof countryAndRegion)[number]>();
    for (const c of countryAndRegion) {
      if (c.nameLocation) map.set(c.nameLocation.toLowerCase(), c);
    }
    return map;
  }, [countryAndRegion]);

  const lookupCountry = (regionName: string) =>
    countryByName.get(regionName.toLowerCase()) ?? null;

  const handleClickGuide = () => router.push(`/guide`);

  const dateLabel = createDate ? formatDateTime(createDate, i18n.language) : '';

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

      <ScrollView className="max-h-[60vh] w-full" contentContainerClassName="gap-3">
        <Text className="mb-2">
          {capitalize(t('esim_info_sheet.email_notice_prefix'))}{' '}
          <Text className="font-semibold text-primary">
            {capitalize(t('esim_info_sheet.email_label'))}
          </Text>
        </Text>

        {items.map((item, itemIdx) => {
          const country = lookupCountry(item.regionName);
          const displayName = country
            ? isEnglish
              ? country.nameLocation
              : country.nameVi
            : item.regionName;

          return (
            <View key={`${itemIdx}-${item.regionName}`} className="gap-2">
              <View className="flex-row items-center gap-2">
                <View className="h-6 w-6 overflow-hidden rounded-full border border-gray-100">
                  <FlagImage country={country} className="h-full w-full" />
                </View>
                <Text className="font-semibold">
                  {t('esim_info_sheet.country_label', { name: displayName })}
                </Text>
              </View>

              <View className="gap-2 rounded-xl border border-gray-100 p-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold">{item.productName}</Text>

                  <Pressable
                    onPress={() => setExpandedItemIdx(expandedItemIdx === itemIdx ? null : itemIdx)}
                    className="flex-row items-center gap-1">
                    <EyeIcon className="h-4 w-4 stroke-2 text-primary" />
                    <Text className="text-xs capitalize text-primary">
                      {t('esim_info_sheet.view_qr')}
                    </Text>
                  </Pressable>
                </View>

                {item.esims.map((esim, simIdx) => (
                  <View key={esim.iccid || simIdx} className="flex-row items-start justify-between">
                    <View className="gap-0.5">
                      <Text className="text-sm">
                        {t('esim_info_sheet.sim_label', { index: simIdx + 1 })}
                      </Text>
                      {dateLabel ? (
                        <Text className="text-xs text-gray-400">{dateLabel}</Text>
                      ) : null}
                    </View>

                    {/* TODO: backend doesn't return per-SIM price yet — placeholder. */}
                    <Text className="text-sm font-semibold">—</Text>
                  </View>
                ))}

                {expandedItemIdx === itemIdx ? (
                  <View className="items-center gap-3 pt-2">
                    {item.esims.map((esim, simIdx) =>
                      esim.qrCode ? (
                        <Image
                          key={esim.iccid || simIdx}
                          source={{ uri: esim.qrCode }}
                          style={{ width: 200, height: 200 }}
                          contentFit="contain"
                        />
                      ) : null
                    )}
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ActionSheet>
  );
};
