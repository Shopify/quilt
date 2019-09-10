import {transform} from '../../transform';
import addInterface from '../addInterface';

describe('addInterface', () => {
  it('adds properties to an exisiting interface', async () => {
    const initial = `
      interface Foo {
        bar?: Baz
      }
    `;

    const result = await transform(
      initial,
      addInterface(`interface Foo {
            qux: Quux;
          }
        `),
    );

    const expected = `interface Foo {
      bar?: Baz;
      qux: Quux;
    }`;

    expect(result).toBeFormated(expected);
  });

  it('adds a new interface', async () => {
    const initial = `const foo: Foo = 'bar';`;

    const result = await transform(
      initial,
      addInterface(`interface Foo {
            qux: Quux;
          }
        `),
    );

    const expected = `
      interface Foo {
        qux: Quux;
      }
      const foo: Foo = 'bar';
    `;

    expect(result).toBeFormated(expected);
  });
});
