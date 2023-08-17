import {abbreviateBusinessName} from '../abbreviateBusinessName';

describe('#abbreviateBusinessName()', () => {
  it('returns input name if no abbreviation found', () => {
    const input = {name: '😀😃😄'};
    expect(abbreviateBusinessName(input)).toBe(input.name);
  });

  it('returns abbreviated name if abbreviation found', () => {
    const input = {name: 'shop-123'};
    expect(abbreviateBusinessName(input)).toBe('sho');
  });
});
