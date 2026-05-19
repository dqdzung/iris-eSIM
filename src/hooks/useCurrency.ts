import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils';

export const useCurrency = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const isEnglish = locale === 'en-US';
  const currency = isEnglish ? 'USD' : 'VND';
  
  const format = useCallback(
    (value: number) => formatCurrency(value, locale, currency),
    [locale, currency]
  );
  return { format, currency, locale, isEnglish };
};
