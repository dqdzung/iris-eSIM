import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { ActionSheet } from './ActionSheet';
import { NativeDatePicker } from './NativeDatePicker';
import PrimaryButton from './PrimaryButton';
import { X } from 'lucide-react';
import { TransactionsFilter } from '@/api/type';

type Props = {
  visible: boolean;
  onClose: () => void;
  value: TransactionsFilter;
  onApply: (next: TransactionsFilter) => void;
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

  const [beginTime, setBeginTime] = useState(value.beginTime ?? todayString());
  const [endTime, setEndTime] = useState(value.endTime ?? todayString());

  const handleApply = () => {
    onApply({
      beginTime: beginTime || undefined,
      endTime: endTime || undefined,
    });
    onClose();
  };

  const invalidRange = beginTime && endTime && beginTime > endTime;

  useEffect(() => {
    if (visible) {
      const today = todayString();
      setBeginTime(value.beginTime ?? today);
      setEndTime(value.endTime ?? today);
    }
  }, [visible, value.beginTime, value.endTime]);

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
              value={beginTime}
              onChange={setBeginTime}
              max={endTime || undefined}
              locale={i18n.language}
            />
          </View>

          <View className="flex-1">
            <Text className="text-xxs text-gray-500">
              {capitalize(t('history_screen.filter.to_date'))}
            </Text>
            <NativeDatePicker
              value={endTime}
              onChange={setEndTime}
              min={beginTime || undefined}
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
