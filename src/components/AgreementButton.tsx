import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AgreementActionSheet } from './AgreementActionSheet';

const AgreementButton = ({ onAccept }: { onAccept?: () => void }) => {
  const { t } = useTranslation();
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const handlePress = () => {
    setIsSheetVisible(true);
  };

  const handleClose = () => {
    setIsSheetVisible(false);
  };

  const handleAcceptAgreement = () => {
    onAccept?.();
    handleClose();
  };

  return (
    <Pressable onPress={handlePress}>
      <Text className="font-semibold capitalize text-primary underline">
        {t('terms_of_service')}
      </Text>
      <AgreementActionSheet
        visible={isSheetVisible}
        onClose={handleClose}
        onAccept={handleAcceptAgreement}
      />
    </Pressable>
  );
};

export default AgreementButton;
