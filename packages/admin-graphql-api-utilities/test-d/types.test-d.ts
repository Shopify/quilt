import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectNotType,
} from 'tsd-lite';

import type {Gid, ShopifyGid} from '../src';
import {composeGid, composeGidFactory} from '../src';

/**
 * Shopify GIDs
 */

expectType<ShopifyGid<'Customers'>>(composeGid('Customers', 123));
expectType<Gid<'shopify', 'Customers'>>(composeGid('Customers', 123));
expectAssignable<string>(composeGid('Customers', 123));
expectNotAssignable<ShopifyGid<'Orders'>>(composeGid('Customers', 123));

/**
 * Custom GIDs
 */

const composeCustomGid = composeGidFactory('custom-app');

expectNotType<ShopifyGid<'Customers'>>(composeCustomGid('Customers', 123));
expectType<Gid<'custom-app', 'Customers'>>(composeCustomGid('Customers', 123));
expectAssignable<string>(composeCustomGid('Customers', 123));
expectNotAssignable<Gid<'custom-app', 'Orders'>>(composeGid('Customers', 123));
