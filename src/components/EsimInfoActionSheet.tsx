import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { TransactionResultItem } from '@/types';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { formatDateTime } from '@/utils';
import { ActionSheet } from './ActionSheet';
import { EsimItemCard } from './EsimItemCard';
import { FlagImage } from './FlagImage';
import { QrOverlay } from './QrOverlay';
import { ChevronDown } from 'lucide-react';
import GuideButton from './GuideButton';

type Props = {
  visible: boolean;
  onClose: () => void;
  items: TransactionResultItem[];
  createDate?: string;
};

export const EsimInfoActionSheet = ({ visible, onClose, items, createDate }: Props) => {
  const { t, i18n } = useTranslation();
  const { countryAndRegion } = useGlobalDataContext();
  const isEnglish = i18n.language === 'en-US';

  const [qrOverlay, setQrOverlay] = useState<{ qrCode: string; iccid: string } | null>(null);

  const countryByName = useMemo(() => {
    const map = new Map<string, (typeof countryAndRegion)[number]>();
    for (const c of countryAndRegion) {
      if (c.nameLocation) map.set(c.nameLocation.toLowerCase(), c);
    }
    return map;
  }, [countryAndRegion]);

  const lookupCountry = (regionName: string) => countryByName.get(regionName.toLowerCase()) ?? null;

  const dateLabel = createDate ? formatDateTime(createDate, i18n.language) : '';

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      overlayClassName="bg-black/30 items-center"
      panelClassName="w-full flex-col gap-5 rounded-t-2xl px-5 py-4"
      footer={
        <View className="w-full bg-gray-100 p-3">
          <GuideButton onClick={onClose} />
        </View>
      }>
      <View className="relative w-full flex-row items-center justify-between">
        <Text className="text-base font-semibold leading-6">
          {capitalize(t('esim_info_sheet.title'))}
        </Text>

        <Pressable onPress={onClose}>
          <ChevronDown className="h-5 w-5" />
        </Pressable>
      </View>

      <Text className="">
        {capitalize(t('esim_info_sheet.email_notice_prefix'))}{' '}
        <Text className="font-semibold text-primary">
          {capitalize(t('esim_info_sheet.email_label'))}
        </Text>
      </Text>

      <ScrollView className="max-h-[50vh] w-full" contentContainerClassName="gap-5">
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

              {item.esims.map((esim, simIdx) => (
                <EsimItemCard
                  key={`${itemIdx}-${simIdx}-${esim.iccid || ''}`}
                  esim={esim}
                  productName={item.productName}
                  simIdx={simIdx}
                  dateLabel={dateLabel}
                  onOpenQr={(e) => setQrOverlay({ qrCode: e.qrCode, iccid: e.iccid })}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

      <QrOverlay
        visible={!!qrOverlay}
        qrCode={qrOverlay?.qrCode ?? ''}
        iccid={qrOverlay?.iccid ?? ''}
        onClose={() => setQrOverlay(null)}
      />
    </ActionSheet>
  );
};
