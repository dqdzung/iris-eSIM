import i18next from 'i18next';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { LanguageActionSheet } from './LanguageActionSheet';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import localization from '@/i18n';

const LanguageSelector = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const currentLang = useMemo(() => {
    const currentLocale = i18next.language;
    return (
      localization.languages.find((lang) => lang.code === currentLocale) ||
      localization.languages[0]
    );
  }, []);

  return (
    <>
      <Pressable className="cursor-pointer" onPress={() => setOpen(true)}>
        <View className="h-8 w-8 rounded-full">
          <Image
            source={currentLang.flagSrc}
            alt={`${t(currentLang.name)} flag`}
            className="h-full w-full object-cover"
          />
        </View>
      </Pressable>

      <LanguageActionSheet visible={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default LanguageSelector;
