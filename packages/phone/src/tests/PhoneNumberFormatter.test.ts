import PhoneNumberFormatter, {
  getRegionCodeFromNumber,
  getCountryCodeFromNumber,
} from '../PhoneNumberFormatter';

describe('PhoneNumberFormatter', () => {
  const subject = new PhoneNumberFormatter('CA');

  describe('#format', () => {
    let formattedNumber: string;

    describe('without + sign', () => {
      describe('in Canada', () => {
        beforeEach(() => {
          subject.update('CA');
          formattedNumber = subject.format('5144319512');
        });

        it('formats the number', () => {
          expect(formattedNumber).toBe('(514) 431-9512');
        });
      });

      describe('in France', () => {
        beforeEach(() => {
          subject.update('FR');
          formattedNumber = subject.format('0607653323');
        });

        it('formats the number', () => {
          expect(formattedNumber).toBe('06 07 65 33 23');
        });
      });

      describe('in Ivory Coast', () => {
        beforeEach(() => {
          subject.update('CI');
          formattedNumber = subject.format('0708990971');
        });

        it('formats the number', () => {
          expect(formattedNumber).toBe('07 08 99 0971');
        });
      });
    });

    describe('with + sign', () => {
      describe('in Canada', () => {
        beforeEach(() => {
          formattedNumber = subject.format('+15144319512');
        });

        it('formats the number and update region code', () => {
          expect(formattedNumber).toBe('+1 514-431-9512');
          expect(subject.countryCode).toBe(1);
          expect(subject.regionCode).toBe('CA');
        });
      });

      describe('in France', () => {
        beforeEach(() => {
          formattedNumber = subject.format('+33607653323');
        });

        it('formats the number and update region code', () => {
          expect(formattedNumber).toBe('+33 6 07 65 33 23');
          expect(subject.countryCode).toBe(33);
          expect(subject.regionCode).toBe('FR');
        });
      });

      describe('in Ivory Coast', () => {
        beforeEach(() => {
          formattedNumber = subject.format('+2250708990971');
        });

        it('formats the number and update region code', () => {
          expect(formattedNumber).toBe('+225 07 08 99 0971');
          expect(subject.countryCode).toBe(225);
          expect(subject.regionCode).toBe('CI');
        });
      });
    });
  });

  describe('#update', () => {
    describe('when regionCode is passed', () => {
      beforeEach(() => {
        subject.update('FR');
      });

      it('sets the country code associated with the region code', () => {
        expect(subject.countryCode).toBe(33);
      });
    });

    describe('when countryCode is passed', () => {
      beforeEach(() => {
        subject.update('FR');
      });

      it('sets the region code associated with the country code', () => {
        expect(subject.regionCode).toBe('FR');
      });
    });
  });

  describe('#getNormalizedNumber', () => {
    let e164Number: string;

    beforeEach(() => {
      subject.update('CA');
      e164Number = subject.getNormalizedNumber('(514) 431-9512');
    });

    it('returns e164 format', () => {
      expect(e164Number).toBe('+15144319512');
    });
  });

  describe('#getNationalNumber', () => {
    it('returns Canadian national number', () => {
      expect(subject.getNationalNumber('+15144319512')).toBe('5144319512');
    });

    it('returns French national number', () => {
      expect(subject.getNationalNumber('+3365454')).toBe('65454');
    });

    it('returns an American national number when the input is digit by digit', () => {
      expect(subject.getNationalNumber('+1 8')).toBe('8');
    });

    it('returns a Russian national number when the input is digit by digit', () => {
      expect(subject.getNationalNumber('+7 12')).toBe('12');
    });

    it('returns ""', () => {
      expect(subject.getNationalNumber('+33')).toBe('');
    });
  });

  describe('#getCountryCodeFromNumber', () => {
    it('returns US country number', () => {
      expect(getCountryCodeFromNumber('+1')).toBe(1);
    });

    it('returns Canadian country number', () => {
      expect(getCountryCodeFromNumber('+15144319512')).toBe(1);
    });

    it('returns French country number', () => {
      expect(getCountryCodeFromNumber('+3365454')).toBe(33);
    });
  });

  describe('#requiresItalianLeadingZero', () => {
    it('returns false for French number', () => {
      expect(subject.requiresItalianLeadingZero('+33680086523')).toBe(false);
    });

    it('returns true for Ivory Coast number', () => {
      expect(subject.requiresItalianLeadingZero('+2250708990971')).toBe(true);
    });

    it('returns undefined for invalid input', () => {
      expect(subject.requiresItalianLeadingZero('INVALID')).toBeUndefined();
    });
  });

  describe('#incompleteNumber', () => {
    it('gets region code from incomplete number', () => {
      expect(getRegionCodeFromNumber('+234')).toBe('NG');
    });
  });
});
