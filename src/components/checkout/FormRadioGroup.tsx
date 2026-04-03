import React, { ReactNode } from 'react';
import { Controller, FieldError } from 'react-hook-form';
import { Text, View } from 'react-native';
import { capitalize } from 'lodash';
import RadioOption from './RadioOption';

interface FormRadioGroupProps {
  fieldName: string;
  control: any;
  label?: string;
  options: { label: ReactNode; value: string }[];
  error?: FieldError;
  required?: boolean;
}

const FormRadioGroup = ({
  fieldName,
  control,
  label,
  options,
  error,
  required = false,
}: FormRadioGroupProps) => {
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange, value } }) => (
        <View className="flex-col gap-1">
          {label && (
            <Text className="text-xs text-gray-500">
              {label} {required && <Text className="text-red-500">*</Text>}
            </Text>
          )}
          {options.map((option) => (
            <RadioOption
              key={option.value}
              label={option.label}
              value={option.value}
              isSelected={value === option.value}
              onPress={onChange}
            />
          ))}
          {error && <Text className="text-red-500">{capitalize(error.message)}</Text>}
        </View>
      )}
    />
  );
};

export default FormRadioGroup;
