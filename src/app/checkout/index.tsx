import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useForm, Controller, SubmitHandler, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutForm, createCheckoutSchema } from '@/components/checkout/form';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();
  const { countryId, variantId, amount, total } = useLocalSearchParams<{
    countryId?: string;
    variantId?: string;
    amount?: string;
    total?: string;
  }>();

  const parsedCountryId = countryId ? parseInt(countryId) : 0;
  const parsedVariantId = variantId ? parseInt(variantId) : 0;
  const parsedAmount = amount ? parseInt(amount) : 0;
  const parsedTotal = total ? parseInt(total) : 0;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      emailConfirm: '',
    },
    resolver: zodResolver(createCheckoutSchema(t)),
  });

  const onSubmit: SubmitHandler<CheckoutForm> = (data: CheckoutForm) => {
    console.log(data);
  };

  return (
    <ScrollView contentContainerClassName="flex-1 gap-3 p-4">
      <Stack.Screen options={{ title: 'Thông tin đặt hàng' }} />
      {/* <Text>countryId: {parsedCountryId}</Text>
      <Text>variantId: {parsedVariantId}</Text>
      <Text>amount: {parsedAmount}</Text>
      <Text>total: {parsedTotal}</Text> */}

      <View className="flex-1 flex-col gap-3">
        <Text className="mb-2">Thông tin người mua</Text>
        {['name', 'phone', 'email', 'emailConfirm'].map((e, index) => {
          return (
            <FormInput
              key={index}
              label={capitalize(t(`checkout_form.${e}`))}
              fieldName={e}
              control={control}
              error={(errors as any)[e]}
            />
          );
        })}
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="mb-2 h-14 items-center justify-center rounded-xl bg-primary">
        <Text className="text-white">Thanh toán</Text>
      </Pressable>
    </ScrollView>
  );
}

const FormInput = ({
  fieldName,
  control,
  error,
  label,
  required = true,
}: {
  fieldName: string;
  control: any;
  error?: FieldError;
  label?: string;
  required?: boolean;
}) => {
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <View className="flex-col gap-1">
            <Text className="text-xs text-gray-500">
              {label} {required && <Text className="text-red-500">*</Text>}
            </Text>
            <TextInput
              className={`h-12 rounded-xl bg-gray-200/80 p-4 ${error ? 'border border-red-500' : ''}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {error && <Text className="text-red-500">{capitalize(error.message)}</Text>}
          </View>
        );
      }}
    />
  );
};
