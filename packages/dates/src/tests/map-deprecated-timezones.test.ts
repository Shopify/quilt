import {mapDeprecatedTimezones} from '../map-deprecated-timezones';

describe('mapDeprecatedTimezones', () => {
  it('maps deprecated timezones', () => {
    const expected = mapDeprecatedTimezones('Cuba');
    expect(expected).toStrictEqual('America/Havana');
  });

  it('does not map supported timezones', () => {
    const expected = mapDeprecatedTimezones('America/Toronto');
    expect(expected).toStrictEqual('America/Toronto');
  });
});
