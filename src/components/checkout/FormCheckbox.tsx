import { Colors } from '@/constants/theme';
import { Checkbox } from 'expo-checkbox';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

const FormCheckbox = ({
  fieldName,
  control,
  label,
}: {
  fieldName: string;
  control: any;
  label?: string;
  required?: boolean;
}) => {
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange, value } }) => {
        return (
          <View className="flex-row items-center gap-2">
            <Checkbox
              className="h-6 w-6"
              color={value ? Colors.primary : undefined}
              value={value}
              onValueChange={onChange}
            />
            <Text className="text-xs text-gray-500">{label}</Text>
          </View>
        );
      }}
    />
  );
};

export default FormCheckbox;
