import { ReactNode, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type Props = {
  title: string;
  children: ReactNode;
  initialOpen?: boolean;
  className?: string;
};

export const CollapsibleCard = ({
  title,
  children,
  initialOpen = false,
  className = '',
}: Props) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <View className={`overflow-hidden rounded-xl bg-white drop-shadow-sm ${className}`}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        className="flex-row items-center justify-between gap-3 p-3">
        <Text className="flex-1 font-semibold">{title}</Text>
        <ChevronDownIcon
          className={`h-5 w-5 stroke-2 text-primary transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </Pressable>
      {open ? <View className="px-3 pb-3">{children}</View> : null}
    </View>
  );
};
