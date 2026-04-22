import { capitalize } from 'lodash';
import { FieldError, Controller } from 'react-hook-form';
import { View, TextInput, Text } from 'react-native';

const FormInput = ({
  fieldName,
  control,
  error,
  label,
  placeholder = '',
  required = true,
  autoFocus = false,
}: {
  fieldName: string;
  control: any;
  error?: FieldError;
  label?: string;
  required?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}) => {
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <View className="flex-1 flex-col gap-1">
            {label ? (
              <Text className="text-xs text-gray-500">
                {label} {required && <Text className="text-red-500">*</Text>}
              </Text>
            ) : null}
            <TextInput
              className={`h-12 rounded-xl bg-gray-100/80 p-4 ${error ? 'border border-red-500' : ''}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              autoFocus={autoFocus}
            />
            {error && <Text className="text-[11px] text-red-500">{capitalize(error.message)}</Text>}
          </View>
        );
      }}
    />
  );
};

export default FormInput;
