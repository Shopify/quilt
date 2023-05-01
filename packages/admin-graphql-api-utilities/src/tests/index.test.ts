import {v4} from 'uuid';

import type {Gid, ShopifyGid} from '..';
import {
  parseGidType,
  parseGid,
  parseGidWithParams,
  composeGidFactory,
  composeGid,
  nodesFromEdges,
  keyFromEdges,
  isGid,
  isGidFactory,
} from '..';

describe('admin-graphql-api-utilities', () => {
  describe('parseGidType()', () => {
    it('returns the type from a GID without param', () => {
      const parsedType = parseGidType(
        'gid://shopify/my_custom_type/my--id__123',
      );

      expect(parsedType).toBe('my_custom_type');
    });

    it('returns the type from a GID with params', () => {
      const parsedType = parseGidType(
        'gid://shopify/my_type/my--id__123?query1=value1&query2=value2',
      );

      expect(parsedType).toBe('my_type');
    });
  });

  describe('parseGid()', () => {
    it('throw Error for an invalid id', () => {
      const key = 'gid://shopify/Section/';
      ['@', '-1', '!1'].forEach((id) =>
        expect(() => parseGid(`${key}/${id}`)).toThrow(
          `Invalid gid: ${key}/${id}`,
        ),
      );
    });

    it('returns the id portion of an unprefixed gid', () => {
      ['1', '1a', v4()].forEach((id) => expect(parseGid(id)).toBe(id));
    });

    it('returns the id portion of a gid for integer ids', () => {
      const id = '12';
      const gid = `gid://shopify/Section/${id}`;
      expect(parseGid(gid)).toBe(id);
    });

    it('returns the id portion of a gid for uuids', () => {
      const id = v4();
      const gid = `gid://shopify/Section/${id}`;
      expect(parseGid(gid)).toBe(id);
    });

    it('returns the id portion of a gid with a query parameter', () => {
      const id = v4();
      const gid = `gid://shopify/Section/${id}?foo=bar`;
      expect(parseGid(gid)).toBe(id);
    });

    it('returns the id portion of a gid with multiple query parameters', () => {
      const id = v4();
      const gid = `gid://shopify/Section/${id}?foo=bar&baz=0`;
      expect(parseGid(gid)).toBe(id);
    });

    it('returns the id portion of a gid with a query parameter with extended character set', () => {
      const id = v4();
      const gid = `gid://shopify/Section/${id}?foo-a=bar_baz`;
      expect(parseGid(gid)).toBe(id);
    });
  });

  describe('parseGidWithParams()', () => {
    it('returns the ID and empty params from a GID without params', () => {
      const parsedGid = parseGidWithParams(
        'gid://shopify/my_type/my--id__123?query1=value1&query2=value2',
      );

      expect(parsedGid.id).toBe('my--id__123');
      expect(parsedGid.params).toStrictEqual({
        query1: 'value1',
        query2: 'value2',
      });
    });

    it('returns the ID and params from a GID with params', () => {
      const parsedGid = parseGidWithParams(
        'gid://custom-app/my_type/my--id__123',
      );

      expect(parsedGid.id).toBe('my--id__123');
      expect(parsedGid.params).toStrictEqual({});
    });
  });

  describe('composeGid()', () => {
    it('returns the composed Gid using key and number id', () => {
      const id = 123;
      const key = 'Section';
      const gid: ShopifyGid<'Section'> = composeGid(key, id);
      expect(gid).toBe(`gid://shopify/${key}/${id}`);
    });

    it('returns the composed Gid using key and string id', () => {
      const id = '456';
      const key = 'Section';
      const gid: ShopifyGid<'Section'> = composeGid(key, id);
      expect(gid).toBe(`gid://shopify/${key}/${id}`);
    });

    it('returns the composed Gid using key and uuid', () => {
      const id = v4();
      const key = 'Section';
      const gid: ShopifyGid<'Section'> = composeGid(key, id);
      expect(gid).toBe(`gid://shopify/${key}/${id}`);
    });

    it('returns the composed Gid with params', () => {
      const id = 'button';
      const key = 'Section';
      const params = {foo: 'bar', hello: 'world'};
      const gid: ShopifyGid<'Section'> = composeGid(key, id, params);
      expect(gid).toBe(`gid://shopify/${key}/${id}?foo=bar&hello=world`);
    });
  });

  describe('composeGidFactory()', () => {
    it('returns a function to compose "shopify" gid', () => {
      const customComposeGid = composeGidFactory('shopify');
      const id = 123;
      const key = 'Section';
      const gid: ShopifyGid<'Section'> = customComposeGid(key, id);
      expect(gid).toBe(`gid://shopify/${key}/${id}`);
    });

    it('returns a function to compose "custom" gid', () => {
      const customComposeGid = composeGidFactory('custom-app');
      const id = 123;
      const key = 'Section';
      const gid: Gid<'custom-app', 'Section'> = customComposeGid(key, id);
      expect(gid).toBe(`gid://custom-app/${key}/${id}`);
    });

    it('returns the composed Gid with params', () => {
      const customComposeGid = composeGidFactory('custom-app');
      const id = 'button';
      const key = 'Section';
      const params = {foo: 'bar', hello: 'world'};
      const gid: Gid<'custom-app', 'Section'> = customComposeGid(
        key,
        id,
        params,
      );
      expect(gid).toBe(`gid://custom-app/${key}/${id}?foo=bar&hello=world`);
    });
  });

  describe('isGid()', () => {
    it('returns true for valid GIDs', () => {
      expect(isGid('gid://shopify/Section/123')).toBe(true);
      expect(isGid('gid://shopify/Section/123?foo=bar')).toBe(true);
      expect(isGid('gid://shopify/Section/123?foo=bar&baz=0')).toBe(true);
      expect(isGid('gid://shopify/Section/123?foo-a=bar_baz')).toBe(true);
    });

    it('returns false for invalid GIDs', () => {
      expect(isGid('gid://shopify/Section/')).toBe(false);
      expect(isGid('gid:/shopify/Section/123')).toBe(false);
      expect(isGid('//shopify/Section/123')).toBe(false);
      expect(isGid('gid://shopify/Section/123 456')).toBe(false);
    });
  });

  describe('isGidFactory()', () => {
    it('returns a function to check for custom GIDs', () => {
      const customIsGid = isGidFactory('custom-app');
      expect(customIsGid('gid://custom-app/Section/123')).toBe(true);
      expect(customIsGid('gid://shopify/Section/123')).toBe(false);
    });
  });

  describe('nodesFromEdges()', () => {
    it('returns the node for each edge', () => {
      const nodeOne = Symbol('Node One');
      const nodeTwo = Symbol('Node Two');
      const edges = [{node: nodeOne}, {node: nodeTwo}];
      expect(nodesFromEdges(edges)).toStrictEqual([nodeOne, nodeTwo]);
    });
  });

  describe('keyFromEdges()', () => {
    it('returns the specify key from each edge', () => {
      const titleOne = 'title one';
      const titleTwo = 'title two';
      const edges = [{node: {title: titleOne}}, {node: {title: titleTwo}}];
      expect(keyFromEdges(edges, 'title')).toStrictEqual([titleOne, titleTwo]);
    });

    it('returns the specify key from each edge, and undeinfed if not found', () => {
      const titleOne = 'title one';
      const titleThree = 'title three';
      const edges = [
        {node: {title: titleOne}},
        {node: {}},
        {node: {title: titleThree}},
      ];
      expect(
        keyFromEdges<{title?: string}, 'title'>(edges, 'title'),
      ).toStrictEqual([titleOne, undefined, titleThree]);
    });
  });
});
