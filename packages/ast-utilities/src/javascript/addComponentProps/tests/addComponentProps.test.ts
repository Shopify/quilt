import * as t from '@babel/types';

import {transform} from '../../transform';
import addComponentProps from '../addComponentProps';

describe('addComponentProps', () => {
  it('adds a single prop to a component with no exisiting props', async () => {
    const initial = `
      <Test />
    `;

    const result = await transform(
      initial,
      addComponentProps(
        [{name: 'someProp', value: t.identifier('someValue')}],
        'Test',
      ),
    );

    expect(result).toStrictEqual(
      expect.stringMatching(/<Test someProp={someValue} \/>/),
    );
  });

  it('adds a miltiple props to a component with no exisiting props', async () => {
    const initial = `
      <Test />
    `;

    const result = await transform(
      initial,
      addComponentProps(
        [
          {name: 'someProp', value: t.identifier('someValue')},
          {name: 'someOtherProp', value: t.identifier('someOtherValue')},
        ],
        'Test',
      ),
    );

    expect(result).toStrictEqual(
      expect.stringMatching(
        /<Test someProp={someValue} someOtherProp={someOtherValue} \/>/,
      ),
    );
  });

  it('adds a miltiple props to a component with exisiting props', async () => {
    const initial = `
      <Test initialProp="initialProp" />
    `;

    const result = await transform(
      initial,
      addComponentProps(
        [
          {name: 'someProp', value: t.identifier('someValue')},
          {name: 'someOtherProp', value: t.identifier('someOtherValue')},
        ],
        'Test',
      ),
    );

    const expected = `<Test initialProp="initialProp" someProp={someValue} someOtherProp={someOtherValue} />;`;

    expect(result).toBeFormated(expected);
  });

  it('adds props that are strings', async () => {
    const initial = `
      <Test initialProp="initialProp" />
    `;

    const result = await transform(
      initial,
      addComponentProps(
        [{name: 'someProp', value: t.stringLiteral('someProp')}],
        'Test',
      ),
    );

    const expected = `<Test initialProp="initialProp" someProp="someProp" />;`;

    expect(result).toBeFormated(expected);
  });

  it('does not add a prop to a component if the prop already exists', async () => {
    const initial = `
      <Test someProp={someValue} />
    `;

    const result = await transform(
      initial,
      addComponentProps(
        [{name: 'someProp', value: t.identifier('someValue')}],
        'Test',
      ),
    );

    expect(result).toStrictEqual(
      expect.stringMatching(/<Test someProp={someValue} \/>/),
    );
  });

  it('allows duplicate props when the noDuplicates option is false', async () => {
    const initial = `
      <Test someProp={someValue} />
    `;

    const result = await transform(
      initial,
      addComponentProps(
        [{name: 'someProp', value: t.identifier('someValue')}],
        'Test',
        {noDuplicates: false},
      ),
    );

    expect(result).toStrictEqual(
      expect.stringMatching(
        /<Test someProp={someValue} someProp={someValue} \/>/,
      ),
    );
  });
});
