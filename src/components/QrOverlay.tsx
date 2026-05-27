import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { useToast } from './Toast';
import { Copy, X } from 'lucide-react';

type Props = {
  visible: boolean;
  qrCode: string;
  iccid: string;
  onClose: () => void;
};

export const QrOverlay = ({ visible, qrCode, iccid, onClose }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();

  const [qrLoading, setQrLoading] = useState(true);

  useEffect(() => {
    if (qrCode) setQrLoading(true);
  }, [qrCode]);

  const handleCopyIccid = async () => {
    if (!iccid) return;
    try {
      await navigator.clipboard.writeText(iccid);
      toast.success(capitalize(t('esim_info_sheet.iccid_copied')));
    } catch {
      // clipboard API can throw if denied; silent fail is fine
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View className="flex-1 items-center justify-center bg-white/60 px-6 backdrop-blur-md">
        <TouchableOpacity onPress={onClose} className="absolute inset-0" />

        <View className="w-full items-center gap-6">
          <Text className="">{t('esim_info_sheet.scan_to_activate')}</Text>

          <View style={{ width: 280, height: 280 }}>
            <Image
              source={{ uri: qrCode }}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
              onLoad={() => setQrLoading(false)}
              onError={() => setQrLoading(false)}
            />
            {qrLoading ? (
              <View className="absolute inset-0 items-center justify-center">
                <ActivityIndicator size="large" color="#5850e8" />
              </View>
            ) : null}
          </View>

          <View className="relative">
            <Pressable
              onPress={handleCopyIccid}
              className="flex-row items-center gap-2 px-3 py-1">
              <Text className="text-xs text-primary">ICCID{iccid}</Text>
              <Copy className="h-4 w-4 stroke-2 text-primary" />
            </Pressable>
            <View className="absolute -left-0.5 -top-0.5 h-2 w-2 border-l-2 border-t-2 border-primary" />
            <View className="absolute -right-0.5 -top-0.5 h-2 w-2 border-r-2 border-t-2 border-primary" />
            <View className="absolute -bottom-0.5 -left-0.5 h-2 w-2 border-b-2 border-l-2 border-primary" />
            <View className="absolute -bottom-0.5 -right-0.5 h-2 w-2 border-b-2 border-r-2 border-primary" />
          </View>

          <Pressable
            onPress={onClose}
            className="h-12 w-12 items-center justify-center rounded-full bg-primary drop-shadow-md">
            <X className="h-6 w-6 stroke-2 text-white" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
