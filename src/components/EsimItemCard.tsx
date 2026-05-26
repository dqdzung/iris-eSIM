import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EyeIcon } from '@heroicons/react/24/outline';
import { EsimInfo } from '@/types';

type Props = {
  esim: EsimInfo;
  productName: string;
  simIdx: number;
  dateLabel?: string;
  onOpenQr: (esim: EsimInfo) => void;
};

export const EsimItemCard = ({ esim, productName, simIdx, dateLabel, onOpenQr }: Props) => {
  const { t } = useTranslation();

  return (
    <View className="gap-2 rounded-xl border border-gray-100 p-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold">{productName}</Text>

        <Pressable
          disabled={!esim.qrCode}
          onPress={() => onOpenQr(esim)}
          className="flex-row items-center gap-1">
          <EyeIcon className="h-4 w-4 stroke-2 text-primary" />
          <Text className="text-xs capitalize text-primary">
            {t('esim_info_sheet.view_qr')}
          </Text>
        </Pressable>
      </View>

      <View className="flex-row items-start justify-between">
        <View className="gap-0.5">
          <Text className="text-sm">
            {t('esim_info_sheet.sim_label', { index: simIdx + 1 })}
          </Text>
          {dateLabel ? <Text className="text-xs text-gray-400">{dateLabel}</Text> : null}
        </View>

        {/* TODO: backend doesn't return per-SIM price yet — placeholder. */}
        <Text className="text-sm font-semibold">—</Text>
      </View>
    </View>
  );
};

