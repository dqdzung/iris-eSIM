import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { ActionSheet } from './ActionSheet';
import { NativeDatePicker } from './NativeDatePicker';
import PrimaryButton from './PrimaryButton';
import { X } from 'lucide-react';

export type DateRange = { fromDate?: string; toDate?: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  value: DateRange;
  onApply: (next: DateRange) => void;
};

const todayString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const HistoryFilterSheet = ({ visible, onClose, value, onApply }: Props) => {
  const { t, i18n } = useTranslation();

  const [fromDate, setFromDate] = useState(value.fromDate ?? todayString());
  const [toDate, setToDate] = useState(value.toDate ?? todayString());

  const handleApply = () => {
    onApply({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });
    onClose();
  };

  const invalidRange = fromDate && toDate && fromDate > toDate;

  useEffect(() => {
    if (visible) {
      const today = todayString();
      setFromDate(value.fromDate ?? today);
      setToDate(value.toDate ?? today);
    }
  }, [visible, value.fromDate, value.toDate]);

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      overlayClassName="bg-black/30 items-center"
      panelClassName="w-full gap-5 rounded-t-2xl px-5 py-4">
      <View className="w-full flex-row items-center justify-between">
        <Text className="text-base font-semibold leading-6">
          {capitalize(t('history_screen.filter.title'))}
        </Text>

        <Pressable onPress={onClose}>
          <X className="h-6 w-6" />
        </Pressable>
      </View>

      <View className="gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-xxs text-gray-500">
              {capitalize(t('history_screen.filter.from_date'))}
            </Text>
            <NativeDatePicker
              value={fromDate}
              onChange={setFromDate}
              max={toDate || undefined}
              locale={i18n.language}
            />
          </View>

          <View className="flex-1">
            <Text className="text-xxs text-gray-500">
              {capitalize(t('history_screen.filter.to_date'))}
            </Text>
            <NativeDatePicker
              value={toDate}
              onChange={setToDate}
              min={fromDate || undefined}
              locale={i18n.language}
            />
          </View>
        </View>

        {invalidRange ? (
          <Text className="text-xs text-red-500">
            {capitalize(t('history_screen.filter.invalid_range'))}
          </Text>
        ) : null}
      </View>

      <PrimaryButton
        onPress={handleApply}
        disabled={!!invalidRange}
        pressableClassName="py-3"
        label={capitalize(t('history_screen.filter.apply'))}
      />
    </ActionSheet>
  );
};
