import {v4} from 'uuid';
import {parseGid, composeGid, nodesFromEdges, keyFromEdges} from '..';

describe('admin-graphql-api-utilities', () => {
  describe('parseGid()', () => {
    it('throw Error for an invalid id', () => {
      const key = 'gid://shopify/Section/';
      ['@', '-1', '!1'].forEach(id =>
        expect(() => parseGid(`${key}/${id}`)).toThrow(
          `Invalid gid: ${key}/${id}`,
        ),
      );
    });

    it('returns the id portion of an unprefixed gid', () => {
      ['1', '1a', v4()].forEach(id => expect(parseGid(id)).toEqual(id));
    });

    it('returns the id portion of a gid for integer ids', () => {
      const id = '12';
      const gid = `gid://shopify/Section/${id}`;
      expect(parseGid(gid)).toEqual(id);
    });

    it('returns the id portion of a gid for uuids', () => {
      const id = v4();
      const gid = `gid://shopify/Section/${id}`;
      expect(parseGid(gid)).toEqual(id);
    });
  });

  describe('composeGid()', () => {
    it('returns the composed Gid using key and number id', () => {
      const id = 123;
      const key = 'Section';
      expect(composeGid(key, id)).toEqual(`gid://shopify/${key}/${id}`);
    });

    it('returns the composed Gid using key and string id', () => {
      const id = '456';
      const key = 'Section';
      expect(composeGid(key, id)).toEqual(`gid://shopify/${key}/${id}`);
    });

    it('returns the composed Gid using key and uuid', () => {
      const id = v4();
      const key = 'Section';
      expect(composeGid(key, id)).toEqual(`gid://shopify/${key}/${id}`);
    });
  });

  describe('nodesFromEdges()', () => {
    it('returns the node for each edge', () => {
      const nodeOne = Symbol('Node One');
      const nodeTwo = Symbol('Node Two');
      const edges = [{node: nodeOne}, {node: nodeTwo}];
      expect(nodesFromEdges(edges)).toEqual([nodeOne, nodeTwo]);
    });
  });

  describe('keyFromEdges()', () => {
    it('returns the specify key from each edge', () => {
      const titleOne = 'title one';
      const titleTwo = 'title two';
      const edges = [{node: {title: titleOne}}, {node: {title: titleTwo}}];
      expect(keyFromEdges(edges, 'title')).toEqual([titleOne, titleTwo]);
    });

    it('returns the specify key from each edge, and undeinfed if not found', () => {
      const titleOne = 'title one';
      const titleThree = 'title three';
      const edges = [
        {node: {title: titleOne}},
        {node: {}},
        {node: {title: titleThree}},
      ];
      expect(keyFromEdges<{title?: string}, 'title'>(edges, 'title')).toEqual([
        titleOne,
        undefined,
        titleThree,
      ]);
    });
  });
});
