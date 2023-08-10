import {formatName} from '../formatName';
import {abbreviateName} from '../abbreviateName';

const locale = 'en';

describe('#abbreviateName()', () => {
  it('returns formatName if no abbreviation found', () => {
    // no abbreviation as has space in family name
    const name = {givenName: 'Michael', familyName: 'van Finkle'};
    expect(abbreviateName({name, locale})).toBe(formatName({name, locale}));
  });

  it('returns abbreviated name if abbreviation found', () => {
    const name = {givenName: 'Michael', familyName: 'Garfinkle'};
    expect(abbreviateName({name, locale})).toBe('MG');
  });
});
