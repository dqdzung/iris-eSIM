import { use as i18nUse, changeLanguage as i18nChangeLang } from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from './locales/en-US.json';
import translationVi from './locales/vi-VN.json';

const DEFAULT_LANGUAGE = 'vi-VN';
const STORAGE_LANGUAGE_KEY = 'lang';

const resources = {
  'en-US': { translation: translationEn },
  'vi-VN': { translation: translationVi },
};

const init = async () => {
  const savedLanguage = await loadLanguage();
  i18nUse(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
};

const loadLanguage = async () => {
  const savedLanguage = (await AsyncStorage.getItem(STORAGE_LANGUAGE_KEY)) || DEFAULT_LANGUAGE;
  return savedLanguage;
};

const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem(STORAGE_LANGUAGE_KEY, lang);
  i18nChangeLang(lang);
};

const languages = [
  {
    code: 'vi-VN',
    name: 'vietnamese',
    flagSrc: require('@assets/vietnamese.svg'),
  },
  {
    code: 'en-US',
    name: 'english',
    flagSrc: require('@assets/english.svg'),
  },
];

export default {
  init,
  changeLanguage,
  loadLanguage,
  languages,
};
