import {transform} from '../../transform';
import addImportSpecifier from '../addImportSpecifier';

describe('addImportSpecifier', () => {
  it('adds a specifier to an import statement that has an exisiting specifier', async () => {
    const initial = `
      import {foo} from './bar';
    `;

    const result = await transform(initial, addImportSpecifier('./bar', 'baz'));

    const expected = `import {foo, baz} from './bar';`;

    expect(result).toBeFormated(expected);
  });

  it('adds multiple specifiers to an import statement that has an exisiting specifier', async () => {
    const initial = `
      import {foo} from './bar';
    `;

    const result = await transform(
      initial,
      addImportSpecifier('./bar', ['baz', 'qux']),
    );

    const expected = `import {foo, baz, qux} from './bar';`;

    expect(result).toBeFormated(expected);
  });

  it('adds an import statement if none exists', async () => {
    const initial = `
      import {foo} from './bar';
    `;

    const result = await transform(
      initial,
      addImportSpecifier('./foo', ['baz', 'qux']),
    );

    const expected = `
      import {baz, qux} from './foo';
			import {foo} from './bar';
		`;
    expect(result).toBeFormated(expected);
  });

  it('doesn’t allow duplicate specifiers', async () => {
    const initial = `
      import {foo} from './bar';
    `;

    const result = await transform(
      initial,
      addImportSpecifier('./bar', ['foo']),
    );

    const expected = `
			import {foo} from './bar';
		`;
    expect(result).toBeFormated(expected);
  });
});
