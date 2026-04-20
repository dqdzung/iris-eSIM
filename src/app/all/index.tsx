import { Stack, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useGlobalDataContext } from '../_layout';
import SearchCountryInput from '@/components/SearchCountryInput';
import ListCountryRegion from '@/components/ListCountryRegion';

const DisplayAllScreen = () => {
  const router = useRouter();

  const { regions } = useGlobalDataContext();

  const handlePress = useCallback((id: string) => router.push(`/detail/${id}`), [router]);

  return (
    <ScrollView className="flex-1">
      <Stack.Screen options={{ title: 'Tất cả' }} />

      <View className="flex-col gap-5 p-4">
        <SearchCountryInput />
        <View>
          <Text className="font-semibold text-primary">Khu vực</Text>
          <ListCountryRegion data={regions} handlePress={handlePress} />
        </View>

        {regions.map((region) => {
          if (!region.countries.length) return null;
          return (
            <View key={region.id}>
              <Text className="font-semibold text-primary">{region.name_vi}</Text>
              <ListCountryRegion data={region.countries} handlePress={handlePress} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DisplayAllScreen;
