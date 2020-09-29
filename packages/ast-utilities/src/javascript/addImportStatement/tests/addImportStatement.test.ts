import {transform} from '../../transform';
import addImportStatement from '../addImportStatement';

describe('addImportStatement', () => {
  it('adds an import statement before an exisiting import statement', async () => {
    const initial = `
      import {foo} from './bar'
    `;

    const result = await transform(
      initial,
      addImportStatement(`import {baz} from './qux'`),
    );

    const expected = `
    import {baz} from './qux';
    import {foo} from './bar';
  `;

    expect(result).toBeFormated(expected);
  });

  it('adds multiple import statements before an exisiting import statement', async () => {
    const initial = `
      import {foo} from './bar'
    `;

    const result = await transform(
      initial,
      addImportStatement([
        `import {baz} from './qux';`,
        `import {quux} from './quuz';`,
      ]),
    );

    const expected = `
        import {quux} from './quuz';
        import {baz} from './qux';
        import {foo} from './bar';
      `;

    expect(result).toBeFormated(expected);
  });
});
