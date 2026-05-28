import { Stack, useLocalSearchParams } from 'expo-router';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Package } from '@/types';
import DaySelector from '@/components/detail/DaySelector';
import DataSelector from '@/components/detail/DataSelector';
import { capitalize } from 'lodash';
import { dataSortFunc, convertDataObjToString, convertDataStringToObj, formatVnd } from '@/utils';
import { fetchPackages } from '@/api';
import { PurchaseActionSheet } from '@/components/detail/PurchaseActionSheet';
import CompatibilityButton from '@/components/CompatibilityButton';
import HistoryButton from '@/components/HistoryButton';
import { Image } from 'expo-image';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavHeader from '@/components/NavHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { useToast } from '@/components/Toast';

export default function DetailScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const { id: countryId } = useLocalSearchParams<{ id: string }>();

  const scrollViewRef = useRef<ScrollView>(null);

  const [tab, setTab] = useState<Tab>('spec');
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [picks, setPicks] = useState<{ day: number | null; data: string | null }>({
    day: null,
    data: null,
  });
  const [isTiktokSupported, setIsTiktokSupported] = useState(false);
  const [isPurchaseSheetVisible, setPurchaseSheetVisible] = useState(false);

  const first = packages[0];
  const name = first?.regionName ?? '';
  const flag = first?.flag ?? '';

  const dayOptions = useMemo(() => {
    const filtered = packages.filter((p) => Boolean(p.tiktok) === isTiktokSupported);
    const days = filtered.map((p) => p.timeLimitDays);
    return [...new Set(days)].sort((a, b) => a - b);
  }, [packages, isTiktokSupported]);

  const selectedDay = useMemo(() => {
    if (picks.day != null && dayOptions.includes(picks.day)) return picks.day;
    return dayOptions[0] ?? 0;
  }, [picks.day, dayOptions]);

  const validDataOptions = useMemo(() => {
    const filteredPackages = packages.filter(
      (p) => p.timeLimitDays === selectedDay && Boolean(p.tiktok) === isTiktokSupported
    );
    const dataStrings = filteredPackages.map((p) => convertDataObjToString(p, t));
    return [...new Set(dataStrings)].sort((a, b) => dataSortFunc(a, b, t));
  }, [packages, selectedDay, isTiktokSupported, t]);

  const selectedData = useMemo(() => {
    if (picks.data != null && validDataOptions.includes(picks.data)) return picks.data;
    return validDataOptions[0] ?? '';
  }, [picks.data, validDataOptions]);

  const selectedPackage = useMemo(() => {
    if (!selectedDay || !selectedData) return null;
    const { amount, unit, isDaily } = convertDataStringToObj(selectedData, t);
    const pkg = packages.find(
      (p) =>
        p.timeLimitDays === selectedDay &&
        Number(p.dataVolume) === amount &&
        p.dataUnit === unit &&
        (isDaily ? p.variantType === 'DAILY' : p.variantType !== 'DAILY') &&
        Boolean(p.tiktok) === isTiktokSupported
    );
    return pkg;
  }, [packages, selectedDay, selectedData, isTiktokSupported, t]);

  const formattedTotal = useMemo(() => formatVnd(selectedPackage?.amount || 0), [selectedPackage]);
  const hasSelectedPackage = Boolean(selectedPackage);

  const handleToggle = useCallback(() => setIsTiktokSupported((v) => !v), []);

  const handleSelectDay = useCallback((day: number) => {
    setPicks({ day, data: null });
  }, []);

  const handleSelectData = useCallback((data: string) => {
    setPicks((prev) => ({ ...prev, data }));
  }, []);

  useEffect(() => {
    if (!countryId) return;
    let cancelled = false;
    setLoading(true);
    fetchPackages(countryId)
      .then((res) => {
        if (cancelled) return;
        if (res.success) setPackages(res.data);
        else toast.error(t('toast.load_country_failed'));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  // Reset picks when packages change (e.g., navigating between countries).
  useEffect(() => {
    setPicks({ day: null, data: null });
  }, [packages]);

  // reopen action sheet when backing from checkout
  // useEffect(() => {
  //   if (!isPurchaseSheetVisible && selectedPackage && path === `/detail/${countryId}`) {
  //     setPurchaseSheetVisible(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [path]);

  useEffect(() => {
    if (hasSelectedPackage) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [hasSelectedPackage]);

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <NavHeader actions={<HistoryButton />} showCallButton={false}>
        <Text className="text-base font-semibold text-white">
          {capitalize(t('nav.detail'))}
        </Text>
      </NavHeader>

      <View className="relative flex-1">
        <ScrollView ref={scrollViewRef} contentContainerClassName="gap-5 p-4 pb-2 h-full">
          {/* header */}
          <View className="flex-row items-center justify-between rounded-xl bg-white px-3 py-2 drop-shadow-sm">
            <View className="flex-row items-center gap-2">
              <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-100">
                <Image source={flag} className="h-full w-full" />
              </View>
              <Text className="text-lg font-medium">{name}</Text>
            </View>

            <CompatibilityButton />
          </View>

          <DaySelector
            dayOptions={dayOptions}
            selectedDay={selectedDay}
            handleSelectDay={handleSelectDay}
          />

          <DataSelector
            selectedData={selectedData}
            validDataOptions={validDataOptions}
            handleSelectData={handleSelectData}
            isTiktokSupported={isTiktokSupported}
            handleToggle={handleToggle}
            selectedDay={selectedDay}
          />

          {/* info */}
          {selectedPackage && (
            <>
              <View className="flex-1 gap-2">
                <View className="w-full flex-row justify-center gap-2">
                  {TABS.map((key) => (
                    <View key={key} className="flex-1">
                      <Text
                        onPress={() => setTab(key)}
                        className={`pb-2 text-center text-gray-400 ${tab === key ? 'font-semibold text-primary' : ''}`}>
                        {capitalize(t(`detail_screen.tab_${key}`))}
                      </Text>
                      <View className={`h-1 rounded-t-lg ${tab === key ? 'bg-primary' : ''}`} />
                    </View>
                  ))}
                </View>

                <ScrollView>{mock[tab]}</ScrollView>
              </View>

              <PurchaseActionSheet
                selectedPackage={selectedPackage}
                visible={isPurchaseSheetVisible}
                onClose={() => setPurchaseSheetVisible(false)}
              />
            </>
          )}
        </ScrollView>

        {selectedPackage && !isPurchaseSheetVisible && (
          <View className="rounded-xl bg-white p-4 shadow-md">
            <View className="flex-row items-center justify-between rounded-xl border-2 border-primary bg-primary/10 p-2.5">
              <View>
                <Text className="text-xs text-gray-500">
                  {capitalize(t('purchase.total_price'))}
                </Text>
                <Text className="text-center text-xl font-semibold">{formattedTotal}</Text>
              </View>

              <PrimaryButton
                onPress={() => setPurchaseSheetVisible(true)}
                label={capitalize(t('buy_now'))}
              />
            </View>
          </View>
        )}

        <LoadingOverlay isVisible={loading} />
      </View>
    </View>
  );
}

const notes = [
  'Nên cài đặt eSIM theo hướng dẫn trước khi bay (khi cài cần có internet), bật sẵn Data Roaming và chuyển sử dụng dữ liệu data sang eSIM Iris',
  'Chúng tôi khuyến khích khách mua nhiều hơn 01 ngày so với nhu cầu để tránh bị hết số ngày sử dụng do lệch múi giờ giữa các quốc gia.',
  'Mỗi eSIM chỉ kích hoạt được 1 lần. Nếu cần dùng lại, bạn phải liên hệ với InfiGate để cấp lại mã QR. Phí cấp lại eSIM là 25.000đ/lần.',
  'Chính sách bảo hành: \n+ Cam kết đổi trả hoặc hoàn tiền 100% nếu lỗi nhà cung cấp \n+ Đổi mới trong 1h khi gặp sự cố khi kích hoạt hoặc sử dụng',
];

type Tab = 'spec' | 'note';

const TABS: Tab[] = ['spec', 'note'];

const mock: Record<Tab, ReactNode> = {
  spec: (
    <View className="gap-2">
      <Text className="text-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A quaerat mollitia dicta? Quidem
        doloremque numquam fuga, deleniti suscipit aliquam iure similique deserunt quos impedit,
        aperiam ipsam tempore harum laborum ab, molestias temporibus. Molestiae animi aliquid quod
        pariatur sint perferendis non, distinctio recusandae, esse quam omnis nobis quae nam ut
        tempore excepturi cumque alias. Ut eius totam facere doloribus rem quas vel. Mollitia ex
        aperiam cumque, recusandae atque deserunt? Ullam aperiam exercitationem architecto hic!
        Asperiores ad fugit provident officia ducimus aspernatur quasi minus harum vel unde mollitia
        rerum voluptatum ipsa quae, explicabo consequatur, voluptatibus iusto a at possimus illum
        beatae dolor.
      </Text>
      <Text className="text-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A quaerat mollitia dicta? Quidem
        doloremque numquam fuga, deleniti suscipit aliquam iure similique deserunt quos impedit,
        aperiam ipsam tempore harum laborum ab, molestias temporibus. Molestiae animi aliquid quod
        pariatur sint perferendis non, distinctio recusandae, esse quam omnis nobis quae nam ut
        tempore excepturi cumque alias. Ut eius totam facere doloribus rem quas vel. Mollitia ex
        aperiam cumque, recusandae atque deserunt? Ullam aperiam exercitationem architecto hic!
        Asperiores ad fugit provident officia ducimus aspernatur quasi minus harum vel unde mollitia
        rerum voluptatum ipsa quae, explicabo consequatur, voluptatibus iusto a at possimus illum
        beatae dolor.
      </Text>
    </View>
  ),
  note: (
    <View className="flex-col gap-2">
      {notes.map((note, index) => (
        <View key={index} className="flex-row items-start gap-3">
          <Text className="text-sm font-semibold text-primary">{index + 1}</Text>
          <Text className="text-xs">{note}</Text>
        </View>
      ))}
    </View>
  ),
};
