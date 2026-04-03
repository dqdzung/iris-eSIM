import React, { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface RadioOptionProps {
  label: ReactNode;
  value: any;
  isSelected: boolean;
  onPress: (value: any) => void;
}

const RadioOption = ({ label, value, isSelected, onPress }: RadioOptionProps) => {
  return (
    <Pressable
      className="flex-row items-center gap-2 border-t border-gray-200 py-3"
      onPress={() => onPress(value)}>
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
          isSelected ? 'border-primary' : 'border-gray-400'
        }`}>
        {isSelected && <View className="h-3 w-3 rounded-full bg-primary" />}
      </View>
      {label}
    </Pressable>
  );
};

export default RadioOption;
