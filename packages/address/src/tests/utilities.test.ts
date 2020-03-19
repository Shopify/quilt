import {fixtures} from '@shopify/address-mocks';

import {renderLineTemplate} from '../utilities';

const Canada = fixtures.country.EN.data.country;

const address = {
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

describe('renderLineTemplate()', () => {
  it('replaces the fields by address fields for Japan', () => {
    const template = '{country} - {city} {zip} {province}';
    expect(renderLineTemplate(Canada, template, address)).toStrictEqual(
      'Canada - 目黒区 100-8994',
    );
  });

  it('replaces non existing province by empty string', () => {
    const template = '{country} - {city} {zip} {province}';
    expect(
      renderLineTemplate(Canada, template, {
        ...address,
        province: 'lol',
      }),
    ).toStrictEqual('Canada - 目黒区 100-8994');
  });

  it('replaces unexisting field by empty if does not exist', () => {
    const template = '{country} - {city} {zip} {province} {what}';
    expect(renderLineTemplate(Canada, template, address)).toStrictEqual(
      'Canada - 目黒区 100-8994',
    );
  });

  it('returns empty string if nothing is replaced', () => {
    const template = '{firstName} - {lastName}';
    expect(renderLineTemplate(Canada, template, address)).toStrictEqual('');
  });

  it('returns empty string if template does not match', () => {
    const template = '[Nope]';
    expect(renderLineTemplate(Canada, template, address)).toStrictEqual('');
  });

  it('returns empty string for province if country does not have zones', () => {
    const template = '{province}';
    expect(
      renderLineTemplate(Canada, template, {
        ...address,
        province: 'NOPE',
      }),
    ).toStrictEqual('');
  });
});
