import {
  getNewCaretPosition,
  setCaretPosition,
  digitOnlyNumber,
  getCleanNumber,
  isFormattingChar,
  getRegionCodeForNumber,
  phoneUtil,
  validatePhoneNumber,
} from '../utilities';

jest.mock('google-libphonenumber', () => ({
  PhoneNumberUtil: {
    getInstance: jest.fn(() => ({...mockPhoneInstance})),
  },
}));

const mockPhoneInstance = {
  getRegionCodeForNumber: jest.fn(),
  isValidNumber: jest.fn(),
  parseAndKeepRawInput: jest.fn(),
};

describe('Utilities', () => {
  beforeEach(() => {
    mockPhoneInstance.getRegionCodeForNumber.mockReset();
    mockPhoneInstance.isValidNumber.mockReset();
    mockPhoneInstance.parseAndKeepRawInput.mockReset();

    mockPhoneInstance.parseAndKeepRawInput.mockImplementation((input) => input);
  });

  describe('#getNewCaretPosition', () => {
    it('returns caret position', () => {
      expect(getNewCaretPosition('foobar', 'foo')).toBe(3);
    });
  });

  describe('#setCaretPosition', () => {
    it('sets caret position', () => {
      const element = document.createElement('input');
      element.value = '123456789';

      setCaretPosition(2, element);

      expect(element.selectionStart).toBe(2);
      expect(element.selectionEnd).toBe(2);
    });
  });

  describe('#digitOnlyNumber', () => {
    it('returns digits only', () => {
      expect(digitOnlyNumber('+1 (514) 431-9512')).toBe('15144319512');
    });

    it('strips letters', () => {
      expect(digitOnlyNumber('+1 (514) 431-9512 ext. 001')).toBe(
        '15144319512001',
      );
    });
  });

  describe('#isFormattingChar', () => {
    it('returns false when the character is not a formatting character', () => {
      expect(isFormattingChar('1')).toBe(false);
    });

    it('returns true when the character is a formatting character', () => {
      expect(isFormattingChar('-')).toBe(true);
      expect(isFormattingChar('(')).toBe(true);
      expect(isFormattingChar(')')).toBe(true);
      expect(isFormattingChar(' ')).toBe(true);
      expect(isFormattingChar('.')).toBe(true);
    });
  });

  describe('#getCleanNumber', () => {
    let cleanNumber: string;

    beforeEach(() => {
      cleanNumber = getCleanNumber('+1 (514) 431-9512');
    });

    it('returns the passed number without the formatting characters', () => {
      expect(cleanNumber).toBe('+15144319512');
    });
  });

  describe('#getRegionCodeForNumber', () => {
    it('calls getRegionCodeForNumber on the phoneUtil instance', () => {
      const phoneNumber = '+15144319512';

      getRegionCodeForNumber(phoneNumber);

      expect(mockPhoneInstance.getRegionCodeForNumber).toHaveBeenCalledWith(
        phoneNumber,
      );
    });

    it('returns the result of calling getRegionCodeForNumber on the phoneUtil instance', () => {
      const regionCode = 'CA';
      mockPhoneInstance.getRegionCodeForNumber.mockImplementation(
        () => regionCode,
      );

      expect(getRegionCodeForNumber('')).toBe(regionCode);
    });

    it('returns empty string if there is an error', () => {
      mockPhoneInstance.getRegionCodeForNumber.mockImplementation(() => {
        throw new Error('test');
      });

      expect(getRegionCodeForNumber('')).toBe('');
    });
  });

  describe('#phoneUtil', () => {
    it('returns the same instance for multiple calls', () => {
      expect(phoneUtil()).toBe(phoneUtil());
    });
  });

  describe('#validatePhoneNumber', () => {
    it('calls isValidNumber on the phoneUtil instance', () => {
      const phoneNumber = '+15144319512';
      const regionCode = 'CA';

      validatePhoneNumber(phoneNumber, regionCode);

      expect(mockPhoneInstance.parseAndKeepRawInput).toHaveBeenCalledWith(
        phoneNumber,
        regionCode,
      );
      expect(mockPhoneInstance.isValidNumber).toHaveBeenCalledWith(phoneNumber);
    });

    it('uses getRegionCodeForNumber if no region code is provided', () => {
      const phoneNumber = '+15144319512';

      validatePhoneNumber(phoneNumber);

      expect(mockPhoneInstance.getRegionCodeForNumber).toHaveBeenCalledWith(
        phoneNumber,
      );
    });

    it('returns the result of calling isValidNumber on the phoneUtil instance', () => {
      mockPhoneInstance.isValidNumber.mockImplementation(() => true);

      expect(validatePhoneNumber('')).toBe(true);
    });

    it('returns false if there is an error', () => {
      mockPhoneInstance.isValidNumber.mockImplementation(() => {
        throw new Error('test');
      });

      expect(validatePhoneNumber('')).toBe(false);
    });
  });
});
