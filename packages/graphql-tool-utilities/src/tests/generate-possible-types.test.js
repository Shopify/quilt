import generatePossibleTypes from '../generate-possible-types.js';
import * as possibleTypes from './fixtures.js'
import * as schema from './schema.json'

describe('generatePossibleTypes', () => {
    it('generates possible types', () => {
        expect(generatePossibleTypes(schema)).toStrictEqual(expect.objectContaining(possibleTypes.possibleTypes));
    });
});
