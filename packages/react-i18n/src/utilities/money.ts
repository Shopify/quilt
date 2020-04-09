export function getCurrencySymbol(
  locale: string,
  options: Intl.NumberFormatOptions,
) {
  const delimiters = ',.';
  const directionControlCharacters = /[\u200E\u200F]/;
  const numReg = new RegExp(`0[${delimiters}]*0*`);

  const currencyStringRaw = formatCurrency(0, locale, options);
  const currencyString = currencyStringRaw.replace(
    directionControlCharacters,
    '',
  );
  const matchResult = numReg.exec(currencyString);
  if (!matchResult) {
    throw new Error(
      `Number input in locale ${locale} is currently not supported.`,
    );
  }
  const formattedAmount = matchResult[0];
  const [currencyPrefix, currencySuffix] = currencyString.split(
    formattedAmount,
  );
  const elements = {
    symbol: currencyPrefix || currencySuffix,
    prefixed: currencyPrefix !== '',
  };

  return elements;
}

function formatCurrency(
  amount: number,
  locale: string,
  options: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    ...options,
  }).format(amount);
}
