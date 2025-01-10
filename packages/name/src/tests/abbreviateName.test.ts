import {formatName} from '../formatName';
import {abbreviateName} from '../abbreviateName';
import * as formatNameFunction from '../formatName';

const locale = 'en';

describe('#abbreviateName()', () => {
  it('returns only givenName abbreviated when familyName is undefined', () => {
    const name = {givenName: 'Michael', familyName: undefined};
    expect(abbreviateName({name, locale})).toBe('M');
  });

  it('returns only familyName abbreviated when givenName is undefined', () => {
    const name = {givenName: undefined, familyName: 'Garfinkle'};
    expect(abbreviateName({name, locale})).toBe('G');
  });

  it('returns undefined if no abbreviation found', () => {
    // no abbreviation as names are undefined
    const name = {givenName: undefined, familyName: undefined};
    expect(abbreviateName({name, locale})).toBeUndefined();
  });

  it('returns formatName if no abbreviation found', () => {
    // no abbreviation as has space in family name
    const name = {givenName: 'Michael', familyName: 'van Finkle'};
    expect(abbreviateName({name, locale})).toBe(formatName({name, locale}));
  });

  it('returns abbreviated name if abbreviation found', () => {
    const name = {givenName: 'Michael', familyName: 'Garfinkle'};
    expect(abbreviateName({name, locale})).toBe('MG');
  });

  it('calls formatName when tryAbbreviateName returns undefined', () => {
    const formatNameSpy = jest
      .spyOn(formatNameFunction, 'formatName')
      .mockImplementation(jest.fn());

    abbreviateName({name: {}, locale});

    expect(formatNameSpy).toHaveBeenCalled();

    formatNameSpy.mockRestore();
  });
});
