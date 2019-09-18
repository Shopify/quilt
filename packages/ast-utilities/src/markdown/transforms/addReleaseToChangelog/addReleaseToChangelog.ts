import build from 'unist-builder';
import unified from 'unified';
import parse from 'remark-parse';

interface Options {
  version: string;
  date: string;
  notes?: string;
}

export default function addReleaseToChangelog({version, date, notes}: Options) {
  return function addReleaseToChangelogPlugin() {
    const commentedUnreleasedNode = build('html', {
      value: '<!-- ## Unreleased -->',
    });
    const releaseVersionNode = build(
      'heading',
      {
        depth: 2,
      },
      [build('text', {value: `${version} - ${date}`})],
    );

    const notesNode = notes
      ? unified()
          .use(parse)
          .parse(notes)
      : null;

    function transformer(tree) {
      tree.children = [
        commentedUnreleasedNode,
        releaseVersionNode,
        notesNode,
        ...tree.children.map(node => {
          const {type, depth, children} = node;

          if (
            type === 'heading' &&
            depth === 2 &&
            children[0].value === 'Unreleased'
          ) {
            return null;
          }

          return node;
        }),
      ].filter(node => node);
    }

    return transformer;
  };
}
