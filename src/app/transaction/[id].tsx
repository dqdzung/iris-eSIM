import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  ChevronRightIcon,
  DevicePhoneMobileIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationCircleIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { fetchTransactions } from '@/api';
import { Country, Transaction } from '@/types';
import { useToast } from '@/components/Toast';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { formatDateTime, formatVnd } from '@/utils';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavHeader from '@/components/NavHeader';
import PrimaryButton from '@/components/PrimaryButton';

const STATUS_STYLE: Record<number, { key: string; className: string }> = {
  0: { key: 'history_screen.status.pending', className: 'text-yellow-600' },
  7: { key: 'history_screen.status.failed', className: 'text-red-600' },
  9: { key: 'history_screen.status.success', className: 'text-green-600' },
};
const DEFAULT_STATUS = { key: 'history_screen.status.pending', className: 'text-gray-500' };

type RowData = { label: string; value: string; valueClassName?: string };

export default function TransactionDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { countryAndRegion } = useGlobalDataContext();

  const isEnglish = i18n.language === 'en-US';

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const countryByCode = useMemo(() => {
    const map = new Map<string, Country>();
    for (const c of countryAndRegion) {
      if (c.code) map.set(c.code, c);
    }
    return map;
  }, [countryAndRegion]);

  const getDisplayName = (packCode: string): string => {
    const code = packCode.split('-')[0];
    const country = countryByCode.get(code);
    if (!country) return packCode;
    const name = isEnglish ? country.nameLocation : country.nameVi;
    return t('history_screen.product_label', { name });
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetchTransactions()
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          const found = res.data.find((x) => x.id === id);
          if (found) setTransaction(found);
        } else {
          toast.error(t('toast.load_transactions_failed'));
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const status = transaction ? (STATUS_STYLE[transaction.status] ?? DEFAULT_STATUS) : null;

  // TODO: backend doesn't return these yet — using placeholders.
  const quantity = 1;
  const discount = 0;
  const total = transaction ? transaction.actualAmount - discount : 0;

  const infoRows: RowData[] =
    transaction && status
      ? [
          {
            label: t('history_screen.detail.transaction_code'),
            value: transaction.trackingId,
            valueClassName: 'text-black',
          },
          {
            label: t('history_screen.detail.service'),
            value: getDisplayName(transaction.packCode),
            valueClassName: 'text-black',
          },
          {
            label: t('history_screen.detail.email'),
            value: transaction.billingCode,
            valueClassName: 'text-black',
          },
          {
            label: t('history_screen.detail.time'),
            value: formatDateTime(transaction.createdTime, i18n.language),
            valueClassName: 'text-black',
          },
          {
            label: t('history_screen.detail.status'),
            value: capitalize(t(status.key)),
            valueClassName: `${status.className}`,
          },
        ]
      : [];

  const amountRows: RowData[] = transaction
    ? [
        {
          label: t('history_screen.detail.amount'),
          value: formatVnd(transaction.actualAmount),
          valueClassName: 'text-black',
        },
        {
          label: t('history_screen.detail.quantity'),
          value: String(quantity),
          valueClassName: 'text-black',
        },
        {
          label: t('history_screen.detail.discount'),
          value: `-${formatVnd(discount)}`,
          valueClassName: 'text-black',
        },
        {
          label: t('history_screen.detail.total'),
          value: formatVnd(total),
          valueClassName: 'font-bold text-primary',
        },
      ]
    : [];

  const handleClickSupport = () => router.push('/support');
  const handleGoHome = () => router.dismissTo('/');

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <NavHeader>
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-[16px] font-medium text-white">
            {capitalize(t('history_screen.detail_title'))}
          </Text>

          <Pressable onPress={handleGoHome}>
            <HomeIcon className="h-5 w-5 stroke-2 font-bold text-white" />
          </Pressable>
        </View>
      </NavHeader>

      <View className="relative flex-1 items-center p-4">
        {transaction && (
          <View className="mt-5 w-full items-center gap-3">
            <View className="absolute -top-5 z-10 h-10 w-10 items-center justify-center rounded-full bg-primary">
              <DocumentMagnifyingGlassIcon className="h-5 w-5 stroke-2 text-white" />
            </View>

            <CardRows rows={infoRows} />
            <CardRows rows={amountRows} />

            {transaction.status === 7 || transaction.status === 0 ? (
              <View className="mt-5 w-full flex-row items-center gap-2 rounded-xl bg-white px-3 py-2 drop-shadow-sm">
                <ExclamationCircleIcon className="h-6 w-6 stroke-2 text-orange-500" />
                <Text className="flex-1 text-[10px] text-gray-500">
                  {capitalize(
                    t(
                      transaction.status === 7
                        ? 'history_screen.detail.failed_refund_notice'
                        : 'history_screen.detail.pending_processing_notice'
                    )
                  )}
                </Text>
              </View>
            ) : (
              <PrimaryButton
                onPress={() => {}}
                className="mt-5 w-full rounded-xl drop-shadow-md"
                pressableClassName="py-3">
                <View className="flex-row items-center justify-center gap-2">
                  {/* <DevicePhoneMobileIcon className="h-5 w-5 text-white" /> */}
                  <Text className="font-semibold capitalize text-white">
                    {t('history_screen.detail.view_esim')}
                  </Text>
                </View>
              </PrimaryButton>
            )}

            <Pressable
              onPress={handleClickSupport}
              className="w-full flex-row items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 drop-shadow-sm">
              <View className="flex-row items-center gap-2">
                <QuestionMarkCircleIcon className="h-6 w-6 stroke-2 text-primary" />
                <Text className="text-[10px] font-semibold capitalize text-primary">
                  {t('history_screen.detail.support_request')}
                </Text>
              </View>

              <ChevronRightIcon className="h-5 w-5 stroke-2 text-primary" />
            </Pressable>
          </View>
        )}

        <LoadingOverlay isVisible={loading} />
      </View>
    </View>
  );
}

const CardRows = ({ rows }: { rows: RowData[] }) => (
  <View className="w-full rounded-lg bg-white p-4 text-gray-400">
    {rows.map((row, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === rows.length - 1;
      const padding = isFirst
        ? 'pb-4'
        : isLast
          ? 'border-t-2 border-gray-100/50 pt-4'
          : 'border-t-2 border-gray-100/50 py-4';
      return (
        <View key={idx} className={`flex-row justify-between ${padding}`}>
          <Text className="text-inherit">{capitalize(row.label)}</Text>
          <Text className={`text-inherit ${row.valueClassName ?? ''}`}>{row.value}</Text>
        </View>
      );
    })}
  </View>
);
