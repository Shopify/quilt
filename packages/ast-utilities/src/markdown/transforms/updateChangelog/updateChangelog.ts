import build from 'unist-builder';

interface Options {
  version: string;
  date: string;
}

export default function updateChangelog({version, date}: Options) {
  return function updateChangelogPlugin() {
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
    const releaseNotes = build('list', {ordered: false}, [
      build('listItem', {}, [
        build('paragraph', {}, [
          build('text', {
            value: 'related @shopify dependency version numbers changed',
          }),
        ]),
      ]),
    ]);

    function transformer(tree) {
      tree.children = [
        commentedUnreleasedNode,
        releaseVersionNode,
        releaseNotes,
        ...tree.children
          .map(node => {
            const {type, depth, children} = node;

            if (
              type === 'heading' &&
              depth === 2 &&
              children[0].value === 'Unreleased'
            ) {
              return null;
            }

            return node;
          })
          .filter(node => node),
      ];
    }

    return transformer;
  };
}
