import { Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react';

type Props = {
  value: string;
  onChange: (next: string) => void;
  min?: string;
  max?: string;
  locale: string;
};

const formatDate = (yyyyMmDd: string, locale: string) => {
  if (!yyyyMmDd) return '';
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));
};

export const NativeDatePicker = ({ value, onChange, min, max, locale }: Props) => (
  <View className="relative w-full">
    <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-1 py-1.5">
      <Text className="text-base">{formatDate(value, locale)}</Text>
      <ChevronDown className="h-4 w-4 stroke-2 text-primary" />
    </View>
    <input
      type="date"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.currentTarget.showPicker?.()}
      onKeyDown={(e) => e.preventDefault()}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
      }}
    />
  </View>
);
