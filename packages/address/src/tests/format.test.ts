import {Address} from '@shopify/address-consts';
import {fixtures} from '@shopify/address-mocks';

import {buildOrderedFields, formatAddress} from '../format';

const Japan = fixtures.countries.JA.data.countries.find(
  ({code}) => code === 'JP',
)!;

const address: Address = {
  company: 'Shopify',
  firstName: '',
  lastName: '',
  address1: '八重洲1-5-3',
  address2: '',
  city: '目黒区',
  province: 'JP-13',
  zip: '100-8994',
  country: 'JP',
  phone: '514 xxx xxxx',
};

describe('formatAddress()', () => {
  it('returns an array of parts of the address', () => {
    const result = formatAddress(address, Japan);

    expect(result).toStrictEqual([
      '日本',
      '〒100-8994 東京都 目黒区 八重洲1-5-3',
      'Shopify',
      '',
      '514 xxx xxxx',
    ]);
  });

  it('does not return {province} if the address does not have it', () => {
    const result = formatAddress(
      {
        ...address,
        province: '',
      },
      Japan,
    );

    expect(result).toStrictEqual([
      '日本',
      '〒100-8994 目黒区 八重洲1-5-3',
      'Shopify',
      '',
      '514 xxx xxxx',
    ]);
  });
});

describe('buildOrderedFields()', () => {
  it('return fields ordered based on the country', () => {
    const result = buildOrderedFields(Japan);

    expect(result).toMatchObject([
      ['company'],
      ['lastName', 'firstName'],
      ['zip'],
      ['country'],
      ['province', 'city'],
      ['address1'],
      ['address2'],
      ['phone'],
    ]);
  });
});
