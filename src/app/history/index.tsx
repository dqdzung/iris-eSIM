import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { fetchTransactions } from '@/api';
import { Country, Transaction } from '@/types';
import { useToast } from '@/components/Toast';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { formatDateTime, formatVnd } from '@/utils';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavHeader from '@/components/NavHeader';
import PrimaryButton from '@/components/PrimaryButton';

type Section = { title: string; sortKey: number; data: Transaction[] };

const PAGE_SIZE = 20;

const STATUS_STYLE: Record<number, { key: string; className: string }> = {
  0: { key: 'history_screen.status.pending', className: 'text-yellow-600' },
  7: { key: 'history_screen.status.failed', className: 'text-red-600' },
  9: { key: 'history_screen.status.success', className: 'text-green-600' },
};
const DEFAULT_STATUS = { key: 'history_screen.status.pending', className: 'text-gray-500' };

export default function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const { countryAndRegion } = useGlobalDataContext();

  const isEnglish = i18n.language === 'en-US';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);

  const hasHistory = transactions.length > 0;

  const countryByCode = useMemo(() => {
    const map = new Map<string, Country>();
    for (const c of countryAndRegion) {
      if (c.code) map.set(c.code, c);
    }
    return map;
  }, [countryAndRegion]);

  const sections: Section[] = useMemo(() => {
    const groups = new Map<number, Transaction[]>();
    for (const item of transactions) {
      const d = new Date(item.createdTime);
      const key = d.getFullYear() * 12 + d.getMonth();
      const bucket = groups.get(key);
      if (bucket) bucket.push(item);
      else groups.set(key, [item]);
    }
    return Array.from(groups.entries())
      .map(([sortKey, data]) => {
        const year = Math.floor(sortKey / 12);
        const month = sortKey % 12;
        const title = t('history_screen.month_label', { month: month + 1, year });
        return { title, sortKey, data };
      })
      .sort((a, b) => b.sortKey - a.sortKey);
  }, [transactions, t]);

  const getDisplayName = (packCode: string): string => {
    const code = packCode.split('-')[0];
    const country = countryByCode.get(code);
    if (!country) return packCode;
    const name = isEnglish ? country.nameLocation : country.nameVi;
    return t('history_screen.product_label', { name });
  };

  const handleGoBackHome = () => {
    router.dismissTo('/');
  };

  useEffect(() => {
    let cancelled = false;
    fetchingRef.current = true;
    setLoading(true);
    fetchTransactions(1, PAGE_SIZE)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setTransactions(res.data);
          setHasMore(res.data.length >= PAGE_SIZE);
        } else {
          toast.error(t('toast.load_transactions_failed'));
        }
      })
      .finally(() => {
        fetchingRef.current = false;
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await fetchTransactions(nextPage, PAGE_SIZE);
    if (res.success) {
      setTransactions((prev) => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(res.data.length >= PAGE_SIZE);
    } else {
      toast.error(t('toast.load_transactions_failed'));
    }
    fetchingRef.current = false;
    setLoadingMore(false);
  }, [page, hasMore, toast, t]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    if (distanceFromBottom <= PAGE_SIZE) loadMore();
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <NavHeader>
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-[16px] font-semibold text-white">
            {capitalize(t('history_screen.title'))}
          </Text>

          <Pressable onPress={() => {}}>
            <FunnelIcon className="h-5 w-5 stroke-2 text-white" />
          </Pressable>
        </View>
      </NavHeader>

      <View className="relative flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow gap-4 p-4"
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {hasHistory
            ? sections.map((section) => (
                <View key={section.sortKey} className="gap-2">
                  <Text className="text-sm font-semibold text-primary">
                    {capitalize(section.title)}
                  </Text>

                  <View className="rounded-lg bg-white drop-shadow-sm">
                    {section.data.map((item, idx) => {
                      const status = STATUS_STYLE[item.status] ?? DEFAULT_STATUS;
                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => router.push(`/transaction/${item.trackingId}`)}
                          className={`flex-row items-center gap-3 p-3 ${
                            idx > 0 ? 'border-t border-gray-100' : ''
                          }`}>
                          {/* Icon placeholder — swap in real icon later */}
                          {/* <View className="h-10 w-10 rounded-md bg-orange-200" /> */}

                          <View className="flex-1 gap-1.5">
                            <Text className="font-semibold" numberOfLines={1}>
                              {getDisplayName(item.packCode)}
                            </Text>
                            <Text className="text-xs text-gray-400">
                              {formatDateTime(item.createdTime, i18n.language)}
                            </Text>
                          </View>

                          <View className="items-end gap-1.5">
                            <Text className="font-semibold">{formatVnd(item.actualAmount)}</Text>
                            <Text className={`text-xs ${status.className}`}>
                              {capitalize(t(status.key))}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))
            : !loading && (
                <View className="flex-1 items-center justify-center gap-4">
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">{capitalize(t('history_screen.empty'))}</Text>
                  </View>

                  <View className="w-full">
                    <PrimaryButton
                      onPress={handleGoBackHome}
                      label={capitalize(t('history_screen.new_transaction'))}
                    />
                  </View>
                </View>
              )}

          {hasHistory && loadingMore && (
            <View className="items-center py-4">
              <ActivityIndicator color="#5850e8" />
            </View>
          )}
        </ScrollView>

        <LoadingOverlay isVisible={loading} />
      </View>
    </View>
  );
}
