import generatePossibleTypes, {
  PossibleTypesError,
} from '../generate-possible-types.js';
import * as possibleTypes from './fixtures.js';
import * as schema from './schema.json';

describe('generatePossibleTypes', () => {
  it('generates possible types', () => {
    expect(generatePossibleTypes(schema)).toStrictEqual(
      expect.objectContaining(possibleTypes.possibleTypes),
    );
  });

  it('throws error if passed an undefined or invalid schema', () => {
    expect(() => {
      generatePossibleTypes(undefined);
    }).toThrow(/TypeError/);
  });
});
