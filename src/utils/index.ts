import { TFunction } from 'i18next';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const formatCurrency = (value: number, locale = 'en-US', currency = 'USD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

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
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
};

// This function keeps the casing unchanged for str, then perform the conversion
const toNonAccentVietnamese = (str: string) => {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
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

const convertDataObjToString = (item: any, t: TFunction) => {
  const isDaily = item.type === 'DAILY';
  return `${item.data_amount}${item.data_unit}${isDaily ? t('per_day') : ''}`;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export {
  delay,
  formatCurrency,
  toLowerCaseNonAccentVietnamese,
  toNonAccentVietnamese,
  dataSortFunc,
  convertDataStringToObj,
  convertDataObjToString,
  shuffleArray,
};
