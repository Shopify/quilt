import {UnicodeCharacterSet} from '../constants';

import {memoizedNumberFormatter} from './translate';

export function getCurrencySymbol(
  locale: string,
  options: Intl.NumberFormatOptions,
) {
  const currencyStringRaw = formatCurrency(0, locale, options);
  const controlChars = new RegExp(
    `${UnicodeCharacterSet.DirectionControl}*`,
    'gu',
  );
  const currencyString = currencyStringRaw.replace(controlChars, '');
  const matchResult = /\p{Nd}\p{Po}*\p{Nd}*/gu.exec(currencyString);
  if (!matchResult) {
    throw new Error(
      `Number input in locale ${locale} is currently not supported.`,
    );
  }
  const formattedAmount = matchResult[0];
  const [currencyPrefix, currencySuffix] =
    currencyString.split(formattedAmount);
  const elements = {
    symbol: currencyPrefix || currencySuffix,
    prefixed: currencyPrefix !== '',
  };

  return elements;
}

export function formatCurrency(
  amount: number,
  locale: string,
  options: Intl.NumberFormatOptions,
) {
  return memoizedNumberFormatter(locale, {
    style: 'currency',
    ...options,
  }).format(amount);
}
