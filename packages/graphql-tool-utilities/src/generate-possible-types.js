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
        console.error(err);
    }

    return possibleTypes;
}

export default generatePossibleTypes;
