import gql from 'graphql-tag';

import {Operations} from '../operations';

const queryOne = gql`
  query One {
    q1
  }
`;

const queryTwo = gql`
  query Two {
    q2
  }
`;

const queryThree = gql`
  query Three {
    q3
  }
`;

const operationOne = {
  query: queryOne,
  operationName: 'One',
  variables: {},
  extensions: {},
  setContext: () => ({}),
  getContext: () => ({}),
  toKey: () => 'One',
};

const operationTwo = {
  query: queryTwo,
  operationName: 'Two',
  variables: {},
  extensions: {},
  setContext: () => ({}),
  getContext: () => ({}),
  toKey: () => 'Two',
};

const operationThree = {
  query: queryThree,
  operationName: 'Three',
  variables: {},
  extensions: {},
  setContext: () => ({}),
  getContext: () => ({}),
  toKey: () => 'Three',
};

describe('Operations', () => {
  describe('#all()', () => {
    it('gets all operations', () => {
      const operations = new Operations();
      operations.push(operationOne, operationTwo);
      expect(operations.all()).toStrictEqual([operationOne, operationTwo]);
    });

    it('gets all matching operations', () => {
      const operationOneClone = {...operationOne};
      const operations = new Operations();
      operations.push(operationOne, operationTwo, operationOneClone);
      expect(operations.all({query: operationOne.query})).toStrictEqual([
        operationOne,
        operationOneClone,
      ]);
    });
  });

  describe('#first()', () => {
    it('gets the first operation', () => {
      const operations = new Operations();
      operations.push(operationOne, operationTwo);
      expect(operations.first()).toBe(operationOne);
    });

    it('gets the first matching operation', () => {
      const operationOneClone = {...operationOne};
      const operations = new Operations();
      operations.push(operationOne, operationOneClone);
      expect(operations.first({query: operationOne.query})).toBe(operationOne);
    });

    it('returns nothing if no matching operations are found', () => {
      const operations = new Operations();
      operations.push(operationOne);
      expect(operations.first({query: operationTwo.query})).toBeUndefined();
    });
  });

  describe('#last()', () => {
    it('gets the last operation', () => {
      const operations = new Operations();
      operations.push(operationOne, operationTwo);
      expect(operations.last()).toBe(operationTwo);
    });

    it('gets the last matching operation', () => {
      const operationOneClone = {...operationOne};
      const operations = new Operations();
      operations.push(operationOne, operationOneClone);
      expect(operations.last({query: operationOne.query})).toBe(
        operationOneClone,
      );
    });

    it('returns nothing if no matching operations are found', () => {
      const operations = new Operations();
      operations.push(operationOne);
      expect(operations.last({query: operationTwo.query})).toBeUndefined();
    });
  });

  describe('#nth()', () => {
    it('gets the nth operation', () => {
      const operations = new Operations();
      operations.push(operationOne, operationTwo, operationThree);
      expect(operations.nth(1)).toBe(operationTwo);
    });

    it('gets the nth matching operation', () => {
      const operationOneClone = {...operationOne};
      const operations = new Operations();
      operations.push(operationOne, operationOneClone, {...operationOne});
      expect(
        operations.nth(1, {operationName: operationOne.operationName}),
      ).toBe(operationOneClone);
    });

    it('returns nothing if no matching operations are found', () => {
      const operations = new Operations();
      operations.push(operationOne);
      expect(operations.nth(0, {query: operationTwo.query})).toBeUndefined();
    });
  });
});
