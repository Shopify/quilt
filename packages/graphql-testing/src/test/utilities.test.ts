import gql from 'graphql-tag';
import {Operations} from '../utilities';

const queryOne = gql`
  {
    q1
  }
`;

const queryTwo = gql`
  {
    q2
  }
`;

const queryThree = gql`
  {
    q3
  }
`;

const operationOne = {
  query: queryOne,
  operationName: 'operation 1',
  variables: {},
  extensions: {},
  setContext: () => ({}),
  getContext: () => ({}),
  toKey: () => 'operation 1',
};

const operationTwo = {
  query: queryTwo,
  operationName: 'operation 2',
  variables: {},
  extensions: {},
  setContext: () => ({}),
  getContext: () => ({}),
  toKey: () => 'operation 2',
};

const operationThree = {
  query: queryThree,
  operationName: 'operation 2',
  variables: {},
  extensions: {},
  setContext: () => ({}),
  getContext: () => ({}),
  toKey: () => 'operation 2',
};

describe('Operations', () => {
  it('gets the last operation', () => {
    const operations = new Operations();
    operations.push(operationOne, operationTwo);
    expect(operations.last()).toBe(operationTwo);
  });

  it('gets the nth operation', () => {
    const operations = new Operations();
    operations.push(operationOne, operationTwo, operationThree);
    expect(operations.nth(1)).toBe(operationTwo);
    expect(operations.nth(-1)).toBe(operationThree);
  });

  it('gets all operations', () => {
    const operations = new Operations();
    operations.push(operationOne, operationTwo, operationThree);
    expect(operations.all()).toStrictEqual([
      operationOne,
      operationTwo,
      operationThree,
    ]);
  });

  it('gets all operations with a matching operationName', () => {
    const operations = new Operations();
    operations.push(operationOne, operationTwo, operationOne);

    expect(
      operations.all({operationName: operationOne.operationName}),
    ).toStrictEqual([operationOne, operationOne]);
  });

  it('gets the last operation with a matching operationName', () => {
    const secondOperationOne = {...operationOne};
    const operations = new Operations();
    operations.push(operationOne, secondOperationOne);

    expect(operations.last({operationName: operationOne.operationName})).toBe(
      secondOperationOne,
    );
  });

  it('throws an error when last operation of type does not exist', () => {
    const operations = new Operations();

    expect(() => operations.last({operationName: 'LostPet'})).toThrow(
      "no operation with operationName 'LostPet' were found.",
    );
  });
});
