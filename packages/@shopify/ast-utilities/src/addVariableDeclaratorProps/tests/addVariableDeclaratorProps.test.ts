import {transform} from '../../transform';

import addVariableDeclaratorProps from '../addVariableDeclaratorProps';

describe('addVariableDeclaratorProps', () => {
  it('adds a prop to the `this.props` variable declarator', async () => {
    const initial = `const { prop1, prop2 } = this.props;`;

    const result = await transform(
      initial,
      addVariableDeclaratorProps('prop3'),
    );

    const expected = `const { prop1, prop2, prop3 } = this.props;`;

    expect(result).toBeFormated(expected);
  });
});
