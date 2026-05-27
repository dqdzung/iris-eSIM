import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Pressable, Text } from 'react-native';
import { SearchActionSheet } from './SearchActionSheet';
import { Search } from 'lucide-react';

const SearchCountryInput = () => {
  const { t } = useTranslation();
  const [isOpenSearch, setOpenSearch] = useState(false);

  return (
    <View className="flex-1 flex-row items-center justify-between rounded-full bg-white p-2 drop-shadow">
      <Pressable
        onPress={() => setOpenSearch(() => true)}
        className="flex-1 flex-row items-center gap-2">
        <Search className="h-5 w-5 stroke-2 text-primary" />
        <Text className="text-xs text-gray-400/80">{t('country_region_placeholder')}</Text>
      </Pressable>

      <SearchActionSheet visible={isOpenSearch} onClose={() => setOpenSearch(false)} />
    </View>
  );
};

export default SearchCountryInput;
