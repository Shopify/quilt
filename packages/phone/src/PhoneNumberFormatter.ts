import {AsYouTypeFormatter, PhoneNumberFormat} from 'google-libphonenumber';

import {
  digitOnlyNumber,
  FORMATTING_CHARACTERS_REGEX,
  getRegionCodeForNumber,
  phoneUtil,
} from './utilities';

const US_COUNTRY_CODE = '1';
const RUSSIA_COUNTRY_CODE = '7';

export default class PhoneNumberFormatter {
  formatter: AsYouTypeFormatter;
  regionCode: string;
  countryCode: number;

  constructor(regionCode: string) {
    this.regionCode = regionCode;
    this.countryCode = getCountryCodeFromRegionCode(regionCode);
    this.formatter = new AsYouTypeFormatter(this.regionCode);
  }

  format(phoneNumber: string): string {
    this.updateCountryCode(phoneNumber);
    this.formatter.clear();
    return formatNumber(phoneNumber, this.formatter) || '';
  }

  /*
   * Update formatter regionCode which will format number based on that
   * region code
   * @regionCode: eg: 'CA' | 'JP' etc.
   */
  update(regionCode: string): void {
    this.countryCode = getCountryCodeFromRegionCode(regionCode);
    this.regionCode = regionCode;
    this.formatter = new AsYouTypeFormatter(this.regionCode);
  }

  // This returns phone number in E164 format.
  getNormalizedNumber(phoneNumber: string): string {
    try {
      const parsedPhoneNumber = phoneUtil().parseAndKeepRawInput(
        phoneNumber,
        this.regionCode,
      );
      return phoneUtil().format(parsedPhoneNumber, PhoneNumberFormat.E164);
    } catch (_err) {
      return phoneNumber;
    }
  }

  getNationalNumber(phoneNumber: string): string {
    const onlyDigitsNumber = digitOnlyNumber(phoneNumber);
    if (!this.regionCode || onlyDigitsNumber.length < 4) {
      // phoneUtil() cannot find the national number when the phone number is too short
      // so we try to guess based on single digit country codes (1 - US, 7 - RU)
      if (
        onlyDigitsNumber.startsWith(US_COUNTRY_CODE) ||
        onlyDigitsNumber.startsWith(RUSSIA_COUNTRY_CODE)
      ) {
        return phoneNumber.slice(3);
      }
      return '';
    }
    try {
      const nationalNumber = phoneUtil()
        .parseAndKeepRawInput(phoneNumber, this.regionCode)
        .getNationalNumber();

      return nationalNumber ? nationalNumber.toString() : '';
    } catch (_err) {
      return '';
    }
  }

  // Indicates if the leading zero of a national number should be retained when dialling internationally
  requiresItalianLeadingZero(phoneNumber: string) {
    try {
      return Boolean(
        phoneUtil()
          .parseAndKeepRawInput(phoneNumber, this.regionCode)
          .getItalianLeadingZero(),
      );
    } catch {
      return undefined;
    }
  }

  /*
   * Updates the country code of the formatter based on the phoneNumber passed
   */
  private updateCountryCode(phoneNumber: string): void {
    if (!phoneNumber.includes('+') || digitOnlyNumber(phoneNumber).length < 1) {
      return;
    }

    let newRegionCode;

    /* If country code is 1, the region code can be CA or US, so we need to
     * guess base on the phone number.
     * This can only be done when phone number is long enough
     */
    if (digitOnlyNumber(phoneNumber).length > 4) {
      newRegionCode = getRegionCodeForNumber(phoneNumber);
    } else {
      const newCountryCode = getCountryCodeFromNumber(phoneNumber);
      if (newCountryCode && this.countryCode !== newCountryCode) {
        newRegionCode = getRegionCodeForCountryCode(newCountryCode);
      }
    }

    if (newRegionCode) {
      this.update(newRegionCode);
    }
  }
}

function getCountryCodeFromRegionCode(regionCode: string): number {
  return phoneUtil().getCountryCodeForRegion(regionCode);
}

export function getRegionCodeFromNumber(phoneNumber: string): string {
  const countryCodeFromNumber = getCountryCodeFromNumber(phoneNumber);

  return (
    getRegionCodeForNumber(phoneNumber) ||
    (countryCodeFromNumber &&
      getRegionCodeForCountryCode(countryCodeFromNumber)) ||
    getRegionCodeForCountryCode(1)
  );
}

export function getCountryCodeFromNumber(
  phoneNumber: string,
): number | undefined {
  /*
   * we map (1 - US, 7 - RU) when the phone number is too short (this handles the key by key input)
   */
  const onlyDigitsNumber = digitOnlyNumber(phoneNumber);
  if (onlyDigitsNumber.length < 4) {
    if (onlyDigitsNumber.startsWith(US_COUNTRY_CODE)) {
      return Number(US_COUNTRY_CODE);
    }
    if (onlyDigitsNumber.startsWith(RUSSIA_COUNTRY_CODE)) {
      return Number(RUSSIA_COUNTRY_CODE);
    }
  }

  try {
    return phoneUtil().parse(phoneNumber).getCountryCode();
  } catch (_err) {
    return parseInt(phoneNumber.split(' ')[0].replace('+', ''), 10);
  }
}

function getRegionCodeForCountryCode(countryCode: number): string {
  return phoneUtil().getRegionCodeForCountryCode(countryCode);
}

function formatNumber(
  phoneNumber: string,
  formatter: AsYouTypeFormatter,
): string | undefined {
  let newValue;

  for (const char of phoneNumber.replace(FORMATTING_CHARACTERS_REGEX, '')) {
    newValue = formatter.inputDigit(char);
  }

  return newValue;
}
