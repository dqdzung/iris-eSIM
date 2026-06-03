import '@/global.css';

import { Stack } from 'expo-router';

import { ToastProvider } from '@/components/Toast';
import { GlobalDataProvider } from '@/contexts/GlobalDataContext';
import localization from '@/i18n';

localization.init();

export default function Layout() {
  return (
    <ToastProvider>
      <GlobalDataProvider>
        <Stack />
      </GlobalDataProvider>
    </ToastProvider>
  );
}
