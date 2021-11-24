import {transform} from '../../transform';
import wrapJsxChildren from '../wrapJsxChildren';

describe('wrapJsxChildren', () => {
  it('wraps a child JSX element with a parent', async () => {
    const initial = `
      <Foo><Baz>{qux}</Baz></Foo>
    `;

    const result = await transform(
      initial,
      wrapJsxChildren(`<Bar></Bar>`, 'Foo'),
    );

    const expected = `<Foo><Bar><Baz>{qux}</Baz></Bar></Foo>;`;

    expect(result).toBeFormated(expected);
  });

  it('wraps a root node', async () => {
    const initial = `
      <Baz>{qux}</Baz>
    `;

    const result = await transform(
      initial,
      wrapJsxChildren(`<Bar></Bar>`, 'Baz'),
    );

    const expected = `<Baz><Bar>{qux}</Bar></Baz>;`;

    expect(result).toBeFormated(expected);
  });
});
