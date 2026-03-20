import { Tabs } from 'expo-router';
import {
  InformationCircleIcon,
  QueueListIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid';
import { Colors } from '@/constants/theme';
import '@/global.css';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useMemo, useState } from 'react';
import { LanguageActionSheet } from '@/components/LanguageActionSheet';
import i18next from 'i18next';
import localization from '@/i18n';
import { Image } from 'expo-image';
import { capitalize } from 'lodash';

localization.init();

export default function TabLayout() {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const currentLocale = i18next.language;

  const currentLang = useMemo(
    () =>
      localization.languages.find((lang) => lang.code === currentLocale) ||
      localization.languages[0],
    [currentLocale]
  );

  return (
    <Tabs
      safeAreaInsets={{ bottom: 10 }}
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShadowVisible: false,
        tabBarStyle: {
          marginTop: 5,
          borderTopWidth: 0, // Removes the top border line
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: capitalize(t('home')),
          header: () => (
            <View className="flex-row justify-between bg-white p-4">
              <View className="h-10 w-[90px]">
                <Image
                  source={require('../../../assets/iris-logo.png')}
                  alt="iris-logo"
                  className="h-full w-full object-cover"
                />
              </View>

              <Pressable className="cursor-pointer" onPress={() => setOpen(true)}>
                <View className="h-8 w-8 rounded-full">
                  <Image
                    source={currentLang.flagSrc}
                    alt={`${t(currentLang.name)} flag`}
                    className="h-full w-full object-cover"
                  />
                </View>
              </Pressable>

              <LanguageActionSheet visible={isOpen} onClose={() => setOpen(false)} />
            </View>
          ),
          tabBarIcon: ({ color }) => <ShoppingBagIcon color={color} style={{ height: 20 }} />,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: capitalize(t('order')),
          tabBarIcon: ({ color }) => <QueueListIcon color={color} style={{ height: 20 }} />,
        }}
      />

      <Tabs.Screen
        name="guide"
        options={{
          title: capitalize(t('guide')),
          tabBarIcon: ({ color }) => <InformationCircleIcon color={color} style={{ height: 20 }} />,
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: capitalize(t('account')),
          tabBarIcon: ({ color }) => <UserCircleIcon color={color} style={{ height: 20 }} />,
        }}
      />
    </Tabs>
  );
}
