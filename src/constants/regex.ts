// Matches a '+84' or '0' followed by a single digit (3, 5, 7, 8, or 9) and then 8 more digits.
export const PHONE_REGEX = new RegExp(/^(((\+|)84)|0)([35789])([0-9]{8})$/);

export const SPECIAL_CHAR_REGEX = /[.*+?^${}()|[\]\\]/g;
