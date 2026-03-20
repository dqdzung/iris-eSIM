import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import localization from '@/i18n';
import i18next from 'i18next';
import { Modal, Pressable, Text, View } from 'react-native';
import { CheckIcon } from '@heroicons/react/16/solid';
import { Image } from 'expo-image';

export const LanguageActionSheet = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const currentLocale = i18next.language;

  const handleLanguageSelect = (langCode: string) => {
    localization.changeLanguage(langCode);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      // Small delay to trigger animation
      setTimeout(() => setIsAnimating(true), 10);
    } else setIsAnimating(false);
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* opaque overlay */}
      <Pressable
        onPress={onClose}
        className={`flex-1 bg-black/70 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
        {/* modal */}
        <Pressable
          onPress={() => null}
          className={`mx-auto flex h-[20%] w-[90%] max-h-[200px] max-w-[500px] rounded-b-2xl bg-white shadow-lg transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-y-0' : '-translate-y-full'
          }`}>
          <View className="h-full w-full flex-col">
            <View className="flex-1 flex-col justify-center gap-5 px-4">
              {localization.languages.map((lang) => (
                <Pressable
                  key={lang.code}
                  onPress={() => handleLanguageSelect(lang.code)}
                  className="w-full flex-row items-center justify-between hover:text-primary">
                  <View className="flex-row items-center gap-2">
                    <View className="h-8 w-8 rounded-full">
                      <Image
                        source={lang.flagSrc}
                        alt={`${t(lang.name)} flag`}
                        className="h-full w-full object-cover"
                      />
                    </View>

                    <Text className="text-xs font-medium capitalize text-inherit">
                      {t(lang.name)}
                    </Text>
                  </View>

                  {currentLocale === lang.code && <CheckIcon className="h-6 w-6 text-primary" />}
                </Pressable>
              ))}
            </View>

            <View className="relative w-full flex-row items-center justify-between border-t border-gray-100 px-4 py-2">
              <View className="h-1 w-1" />

              <Text className="text-center font-bold capitalize">{t('change_language')}</Text>
              <Pressable onPress={onClose}>
                <XMarkIcon className="h-6 w-6" />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
