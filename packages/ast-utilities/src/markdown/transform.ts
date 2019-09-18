import unified from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';

export async function transform(initial: string, ...transforms: any[]) {
  const result = await unified()
    .use(parse)
    .use({
      plugins: [...transforms],
      settings: {bullet: '-', emphasis: '*', fences: true, position: false},
    })
    .use(stringify)
    .process(initial);

  return result.contents;
}
