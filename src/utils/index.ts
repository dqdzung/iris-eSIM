import type { TFunction } from 'i18next';

import type { Package } from '@/types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const formatCurrency = (value: number, locale = 'en-US', currency = 'USD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatVnd = (value: number) => formatCurrency(value, 'vi-VN', 'VND');

const formatDateTime = (iso: string, locale = 'en-US') =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));

// This function converts the string to lowercase, then perform the conversion
const toLowerCaseNonAccentVietnamese = (str: string) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/̀|́|̃|̉|̣/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/ˆ|̆|̛/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
};

const dataSortFunc = (a: string, b: string, t: TFunction) => {
  const extractValue = (str: string): number => {
    const value = parseInt(str);
    const unit = str.replace(String(value), '').replace(`${t('per_day')}`, '');
    if (unit === 'GB') return value * 1000; // Convert GB to MB for comparison
    return value; // Assume MB if unit is not GB
  };

  const aValue = extractValue(a);
  const bValue = extractValue(b);

  if (aValue === 0 && bValue !== 0) return 1;
  if (bValue === 0 && aValue !== 0) return -1;
  if (aValue !== bValue) {
    return aValue - bValue;
  }
  const aIsDaily = a.includes(`${t('per_day')}`);
  const bIsDaily = b.includes(`${t('per_day')}`);
  return aIsDaily && !bIsDaily ? -1 : bIsDaily && !aIsDaily ? 1 : 0;
};

const convertDataStringToObj = (item: string, t: TFunction) => {
  const isDaily = item.includes(t('per_day'));
  const cleanedItem = item.replace(t('per_day'), '');
  const [amountStr, unit] = cleanedItem.split(/([A-Za-z]+)/).filter(Boolean);
  const amount = parseFloat(amountStr);

  return {
    amount,
    unit,
    isDaily,
  };
};

const convertDataObjToString = (item: Package, t: TFunction) => {
  const isDaily = item.variantType === 'DAILY';
  return `${Number(item.dataVolume)}${item.dataUnit}${isDaily ? t('per_day') : ''}`;
};

export {
  convertDataObjToString,
  convertDataStringToObj,
  dataSortFunc,
  delay,
  formatCurrency,
  formatDateTime,
  formatVnd,
  toLowerCaseNonAccentVietnamese,
};
