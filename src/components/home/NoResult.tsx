import { capitalize } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

const NoResult = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center">
      <Text className="text-lg italic">{capitalize(t('no_result'))}</Text>
    </View>
  );
};

export default NoResult;
