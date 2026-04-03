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
import TabBarIcon from '@/components/tabBar/TabIcon';

localization.init();

const tabBarStyle = {
  marginTop: 2,
  paddingTop: 12,
  borderTopWidth: 0, // Removes the top border line
  height: 70,
  borderRadius: 16,
};

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      // safeAreaInsets={{ bottom: 10 }}
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShadowVisible: false,
        tabBarStyle,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: capitalize(t('home')),
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={ShoppingBagIcon} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: capitalize(t('order')),
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={QueueListIcon} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="guide"
        options={{
          title: capitalize(t('guide')),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon Icon={InformationCircleIcon} focused={focused} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="account"
        options={{
          title: capitalize(t('account')),
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={UserCircleIcon} focused={focused} />,
        }}
      /> */}
    </Tabs>
  );
}
