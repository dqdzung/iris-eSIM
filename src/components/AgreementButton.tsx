import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { AgreementActionSheet } from './AgreementActionSheet';

const AgreementButton = ({ onAccept }: { onAccept?: () => void }) => {
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
      <Text className="font-semibold text-primary underline">Điều khoản dịch vụ</Text>
      <AgreementActionSheet
        visible={isSheetVisible}
        onClose={handleClose}
        onAccept={handleAcceptAgreement}
      />
    </Pressable>
  );
};

export default AgreementButton;
