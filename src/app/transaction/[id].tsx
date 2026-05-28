import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { fetchTransactionResult } from '@/api';
import { TransactionResult, TransactionStatus } from '@/types';
import { useToast } from '@/components/Toast';
import { formatDateTime } from '@/utils';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavHeader from '@/components/NavHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { EsimInfoActionSheet } from '@/components/EsimInfoActionSheet';
import { ChevronRight, CircleAlert, CircleHelp, FileSearch, House } from 'lucide-react';

const STATUS_STYLE: Record<TransactionStatus, { key: string; className: string }> = {
  PENDING: { key: 'history_screen.status.pending', className: 'text-yellow-600' },
  FAILED: { key: 'history_screen.status.failed', className: 'text-red-600' },
  SUCCESS: { key: 'history_screen.status.success', className: 'text-green-600' },
};
const DEFAULT_STATUS = { key: 'history_screen.status.pending', className: 'text-gray-500' };

type RowData = { label: string; value: string; valueClassName?: string };

export default function TransactionDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { id: trackingId } = useLocalSearchParams<{ id: string }>();

  const [transaction, setTransaction] = useState<TransactionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!trackingId) return;
    let cancelled = false;
    setLoading(true);
    fetchTransactionResult(trackingId)
      .then((res) => {
        if (cancelled) return;
        if (res.success) setTransaction(res.data);
        else toast.error(t('toast.load_transactions_failed'));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingId]);

  const status = transaction ? (STATUS_STYLE[transaction.status] ?? DEFAULT_STATUS) : null;
  const firstItem = transaction?.items?.[0];
  const serviceLabel = firstItem ? `${firstItem.regionName} - ${firstItem.productName}` : '';

  const infoRows: RowData[] =
    transaction && status
      ? [
          {
            label: t('history_screen.detail.transaction_code'),
            value: transaction.trackingId,
          },
          {
            label: t('history_screen.detail.service'),
            value: serviceLabel,
          },
          {
            label: t('history_screen.detail.email'),
            value: transaction.email,
          },
          {
            label: t('history_screen.detail.time'),
            value: transaction.createDate
              ? formatDateTime(transaction.createDate, i18n.language)
              : '',
          },
          {
            label: t('history_screen.detail.status'),
            value: capitalize(t(status.key)),
            valueClassName: `${status.className}`,
          },
        ]
      : [];

  // TODO: backend doesn't return these yet — using placeholders.
  const amountRows: RowData[] = transaction
    ? [
        {
          label: t('history_screen.detail.amount'),
          value: '—',
        },
        {
          label: t('history_screen.detail.quantity'),
          value: '—',
        },
        {
          label: t('history_screen.detail.discount'),
          value: '—',
        },
        {
          label: t('history_screen.detail.total'),
          value: '—',
        },
      ]
    : [];

  const handleClickSupport = () => router.push('/support');
  const handleGoHome = () => router.dismissTo('/');
  const handleClickInfo = () => {
    setVisible(true);
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <NavHeader
        actions={
          <Pressable onPress={handleGoHome}>
            <House className="h-5 w-5 stroke-2 font-bold text-white" />
          </Pressable>
        }>
        <Text className="text-base font-medium text-white">
          {capitalize(t('history_screen.detail_title'))}
        </Text>
      </NavHeader>

      <View className="relative flex-1 items-center p-4">
        {transaction && (
          <View className="mt-5 w-full items-center gap-3">
            <View className="absolute -top-5 z-10 h-10 w-10 items-center justify-center rounded-full bg-primary">
              <FileSearch className="h-5 w-5 stroke-2 text-white" />
            </View>

            <CardRows rows={infoRows} />
            <CardRows rows={amountRows} />

            {transaction.status === 'FAILED' || transaction.status === 'PENDING' ? (
              <View className="mt-5 w-full flex-row items-center gap-2 rounded-xl bg-white px-3 py-2 drop-shadow-sm">
                <CircleAlert className="h-6 w-6 stroke-2 text-orange-500" />
                <Text className="flex-1 text-xxs text-gray-500">
                  {capitalize(
                    t(
                      transaction.status === 'FAILED'
                        ? 'history_screen.detail.failed_refund_notice'
                        : 'history_screen.detail.pending_processing_notice'
                    )
                  )}
                </Text>
              </View>
            ) : (
              <PrimaryButton
                onPress={handleClickInfo}
                className="mt-5 w-full rounded-xl drop-shadow-md"
                pressableClassName="py-3">
                <View className="flex-row items-center justify-center gap-2">
                  {/* <Smartphone className="h-5 w-5 text-white" /> */}
                  <Text className="font-semibold text-white">
                    {capitalize(t('history_screen.detail.view_esim'))}
                  </Text>
                </View>
              </PrimaryButton>
            )}

            <Pressable
              onPress={handleClickSupport}
              className="w-full flex-row items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 drop-shadow-sm">
              <View className="flex-row items-center gap-2">
                <CircleHelp className="h-6 w-6 stroke-2 text-primary" />
                <Text className="text-xxs font-semibold text-primary">
                  {capitalize(t('history_screen.detail.support_request'))}
                </Text>
              </View>

              <ChevronRight className="h-5 w-5 stroke-2 text-primary" />
            </Pressable>
          </View>
        )}

        <EsimInfoActionSheet
          visible={visible}
          onClose={() => setVisible(false)}
          items={transaction?.items ?? []}
          createDate={transaction?.createDate}
        />
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
          <Text className={row.valueClassName ?? ''}>{row.value}</Text>
        </View>
      );
    })}
  </View>
);
