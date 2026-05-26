import React, { ReactNode, useEffect, useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

type ActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  position?: 'top' | 'bottom';
  overlayClassName?: string;
  panelClassName?: string;
  footer?: ReactNode;
  children: ReactNode;
};

export const ActionSheet = ({
  visible,
  onClose,
  position = 'bottom',
  overlayClassName = 'bg-black/30',
  panelClassName = '',
  footer,
  children,
}: ActionSheetProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) setTimeout(() => setIsAnimating(true), 10);
    else setIsAnimating(false);
  }, [visible]);

  if (!visible) return null;

  const slideClosed = position === 'bottom' ? 'translate-y-full' : '-translate-y-full';
  const tapToClose = <TouchableOpacity onPress={onClose} className="w-full flex-1" />;

  const panel = (
    <View
      className={`bg-white shadow-lg transition-transform duration-300 ease-out ${panelClassName} ${
        isAnimating ? 'translate-y-0' : slideClosed
      }`}>
      {children}
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="none">
      <View
        className={`flex-1 transition-opacity duration-300 ${overlayClassName} ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}>
        {position === 'bottom' ? (
          <>
            {tapToClose}
            {panel}
            {footer}
          </>
        ) : (
          <>
            {panel}
            {tapToClose}
            {footer}
          </>
        )}
      </View>
    </Modal>
  );
};
