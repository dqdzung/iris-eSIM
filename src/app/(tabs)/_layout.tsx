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
import localization from '@/i18n';
import { capitalize } from 'lodash';

localization.init();

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      safeAreaInsets={{ bottom: 10 }}
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShadowVisible: false,
        tabBarStyle: {
          marginTop: 2,
          borderTopWidth: 0, // Removes the top border line
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: capitalize(t('home')),
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
