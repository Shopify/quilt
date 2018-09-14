import {mapDeprecatedTimezones} from '../map-deprecated-timezones';

describe('mapDeprecatedTimezones', () => {
  it('maps deprecated timezones', () => {
    const expected = mapDeprecatedTimezones('Cuba');
    expect(expected).toEqual('America/Havana');
  });

  it('does not map supported timezones', () => {
    const expected = mapDeprecatedTimezones('America/Toronto');
    expect(expected).toEqual('America/Toronto');
  });
});
