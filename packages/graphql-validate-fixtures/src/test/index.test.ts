import * as glob from 'glob';
import {join} from 'path';
import {evaluateFixtures} from '../index';

const fixturePath = join(__dirname, 'fixtures');
const schemaPath = join(fixturePath, 'schema.graphql');
const fixturePaths = glob.sync(join(fixturePath, 'fixtures/**/*.json'));
const operationPaths = glob.sync(join(fixturePath, 'queries/**/*.graphql'));

describe('evaluateFixtures()', () => {
  it('works', async () => {
    // console.log(JSON.stringify(await evaluateFixtures({
    //   schemaPath,
    //   fixturePaths,
    //   documentPaths: operationPaths,
    // }), null, 2));
  });
});
