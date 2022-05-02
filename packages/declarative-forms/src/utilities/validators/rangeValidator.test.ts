import {SchemaNode} from '../../types';
import {ValidationError} from '../../classes/ValidationError';

import {rangeValidator} from './rangeValidator';

describe('rangeValidator', () => {
  it('returns null when the value is less than the maximum', () => {
    const result = rangeValidator(
      '99',
      {name: 'Range', maximum: 100},
      {} as SchemaNode,
    );

    expect(result).toBeNull();
  });

  it('returns null when the value is equal to the maximum', () => {
    const result = rangeValidator(
      '100',
      {name: 'Range', maximum: 100},
      {} as SchemaNode,
    );

    expect(result).toBeNull();
  });

  it('returns null when the value is equal to the minimum', () => {
    const result = rangeValidator(
      '0',
      {name: 'Range', minimum: 0},
      {} as SchemaNode,
    );

    expect(result).toBeNull();
  });

  it('returns null when the value is greater than the minimum', () => {
    const result = rangeValidator(
      '1',
      {name: 'Range', minimum: 0},
      {} as SchemaNode,
    );

    expect(result).toBeNull();
  });

  it('returns a validator error when the value is above the maximum', () => {
    const result = rangeValidator(
      '101',
      {name: 'Range', maximum: 100},
      {} as SchemaNode,
    );

    expect(result).toStrictEqual(
      new ValidationError('Range', {
        maximum: 100,
        minimum: 0,
        message: undefined,
      }),
    );
  });

  it('returns a validator error when the value is below the minimum', () => {
    const result = rangeValidator(
      '-1',
      {name: 'Range', minimum: 0},
      {} as SchemaNode,
    );

    expect(result).toStrictEqual(
      new ValidationError('Range', {
        maximum: 100,
        minimum: 0,
        message: undefined,
      }),
    );
  });
});
