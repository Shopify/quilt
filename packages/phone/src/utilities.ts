import {PhoneNumberUtil, PhoneNumberFormat} from 'google-libphonenumber';

export {PhoneNumberFormat};
export const FORMATTING_CHARACTERS_REGEX = /[()\-. ]+/g;

let phoneNumberUtil: PhoneNumberUtil;

/*
 * This is to get the cursor position when adding characters in the middle
 * of the number.
 */
export function getNewCaretPosition(textBeforeCaret: string, fullText: string) {
  let caretPosition = 0;
  let textCopy = textBeforeCaret;

  for (const char of fullText) {
    if (!textCopy && !isFormattingChar(char)) {
      break;
    }

    if (char === textCopy[0]) {
      textCopy = textCopy.substring(1);
    }

    caretPosition++;
  }

  return caretPosition;
}

export function setCaretPosition(position: number, element?: HTMLInputElement) {
  if (!element) {
    return;
  }

  if (typeof element.selectionStart === 'undefined') {
    element.focus();
    return;
  }

  element.focus();
  element.setSelectionRange(position, position);
}

export function digitOnlyNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

export function isFormattingChar(char: string): boolean {
  return char.search(FORMATTING_CHARACTERS_REGEX) > -1;
}

export function getCleanNumber(phoneNumber: string): string {
  return phoneNumber.replace(FORMATTING_CHARACTERS_REGEX, '');
}

export function getRegionCodeForNumber(
  phoneNumber: string,
): string | undefined {
  try {
    const parsedPhoneNumber = phoneUtil().parseAndKeepRawInput(phoneNumber);
    return phoneUtil().getRegionCodeForNumber(parsedPhoneNumber);
  } catch (_err) {
    return '';
  }
}

export function phoneUtil(): PhoneNumberUtil {
  return phoneNumberUtil || (phoneNumberUtil = PhoneNumberUtil.getInstance());
}

export function validatePhoneNumber(phoneNumber: string, regionCode?: string) {
  try {
    return phoneUtil().isValidNumber(
      phoneUtil().parseAndKeepRawInput(
        phoneNumber,
        regionCode || getRegionCodeForNumber(phoneNumber),
      ),
    );
  } catch {
    return false;
  }
}
