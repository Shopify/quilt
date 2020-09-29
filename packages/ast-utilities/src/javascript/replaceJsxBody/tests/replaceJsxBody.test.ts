import {transform} from '../../transform';
import replaceJsxBody from '../replaceJsxBody';

describe('replaceJsxBody', () => {
  it('wraps a child JSX element with a parent', async () => {
    const initial = `
      <Foo><Baz>{qux}</Baz></Foo>
    `;

    const result = await transform(
      initial,
      replaceJsxBody(`<Bar></Bar>`, 'Baz'),
    );

    const expected = `<Foo><Bar><Baz>{qux}</Baz></Bar></Foo>;`;

    expect(result).toBeFormated(expected);
  });
});
