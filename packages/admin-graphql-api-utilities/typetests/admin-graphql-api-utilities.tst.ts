import {describe, it, expect} from 'tstyche';

import type {Gid, ShopifyGid} from '../src';
import {composeGid, composeGidFactory} from '../src';

describe('composeGid', () => {
  it('composes Gid using key and number id', () => {
    expect(composeGid('Customers', 123)).type.toEqual<
      ShopifyGid<'Customers'>
    >();
    expect(composeGid('Customers', 123)).type.toEqual<
      Gid<'shopify', 'Customers'>
    >();

    expect(composeGid('Customers', 123)).type.toMatch<string>();
    expect(composeGid('Customers', 123)).type.not.toMatch<
      ShopifyGid<'Orders'>
    >();
  });
});

describe('composeGidFactory', () => {
  it('composes custom Gid using key and number id', () => {
    const composeCustomGid = composeGidFactory('custom-app');

    expect(composeCustomGid('Customers', 123)).type.not.toEqual<
      ShopifyGid<'Customers'>
    >();
    expect(composeCustomGid('Customers', 123)).type.toEqual<
      Gid<'custom-app', 'Customers'>
    >();

    expect(composeCustomGid('Customers', 123)).type.toMatch<string>();
    expect(composeGid('Customers', 123)).type.not.toMatch<
      Gid<'custom-app', 'Orders'>
    >();
  });
});
