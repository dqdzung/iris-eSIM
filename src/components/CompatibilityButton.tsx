import { LinearGradient } from 'expo-linear-gradient';
import { capitalize } from 'lodash';
import { Info } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { CompatibilityActionSheet } from './CompatibilityActionSheet';

const CompatibilityButton = () => {
  const { t } = useTranslation();
  const [isSheetVisible, setSheetVisible] = useState(false);

  return (
    <View>
      <LinearGradient
        className="rounded-full drop-shadow-md"
        start={{ x: 1, y: 0 }}
        colors={['rgba(221, 219, 255, 1)', 'rgba(255, 255, 255, 1)']}>
        <Pressable
          className="flex-row items-center gap-1 px-2.5 py-1.5"
          onPress={() => setSheetVisible(true)}>
          <Info className="h-4 w-4 stroke-2 text-primary" />
          <Text className="text-xs font-medium text-primary">
            {capitalize(t('check_compatibility'))}
          </Text>
        </Pressable>
      </LinearGradient>

      {isSheetVisible && (
        <CompatibilityActionSheet visible={isSheetVisible} onClose={() => setSheetVisible(false)} />
      )}
    </View>
  );
};

export default CompatibilityButton;
