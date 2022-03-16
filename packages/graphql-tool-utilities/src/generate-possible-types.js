const fs = require('fs');

function generatePossibleTypes(schema) {
    const possibleTypes = {};

    try {
        schema.data.__schema.types.forEach(supertype => {
            if (supertype.possibleTypes) {
                possibleTypes[supertype.name] =
                    supertype.possibleTypes.map(subtype => subtype.name);
            }
        });
    } catch (err) {
        throw new PossibleTypesError(err);
    }

    return possibleTypes;
}

export class PossibleTypesError extends Error { };

export default generatePossibleTypes;
