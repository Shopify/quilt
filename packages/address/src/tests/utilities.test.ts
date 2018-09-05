import {Country} from '../types';
import {renderLineTemplate} from '../utilities';
import {countryJpJa} from './fixtures';

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
    expect(
      renderLineTemplate(
        countryJpJa.data.country as Country,
        template,
        address,
      ),
    ).toEqual('日本 - 目黒区 100-8994 東京都');
  });

  it('replaces non existing province by empty string', () => {
    const template = '{country} - {city} {zip} {province}';
    expect(
      renderLineTemplate(countryJpJa.data.country as Country, template, {
        ...address,
        province: 'lol',
      }),
    ).toEqual('日本 - 目黒区 100-8994');
  });

  it('replaces unexisting field by empty if does not exist', () => {
    const template = '{country} - {city} {zip} {province} {what}';
    expect(
      renderLineTemplate(
        countryJpJa.data.country as Country,
        template,
        address,
      ),
    ).toEqual('日本 - 目黒区 100-8994 東京都');
  });

  it('returns empty string if nothing is replaced', () => {
    const template = '{firstName} - {lastName}';
    expect(
      renderLineTemplate(
        countryJpJa.data.country as Country,
        template,
        address,
      ),
    ).toEqual('');
  });

  it('returns empty string if template does not match', () => {
    const template = '[Nope]';
    expect(
      renderLineTemplate(
        countryJpJa.data.country as Country,
        template,
        address,
      ),
    ).toEqual('');
  });

  it('returns empty string for province if country does not have provinces', () => {
    const template = '{province}';
    expect(
      renderLineTemplate(countryJpJa.data.country as Country, template, {
        ...address,
        province: 'NOPE',
      }),
    ).toEqual('');
  });
});
