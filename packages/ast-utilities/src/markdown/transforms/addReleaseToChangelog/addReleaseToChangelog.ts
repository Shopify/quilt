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
      value: '<!-- ## [Unreleased] -->',
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
      tree.children = flatten(
        tree.children.map(node => {
          if (isUnreleasdHeading(node) || isUnreleasdComment(node)) {
            return [
              commentedUnreleasedNode,
              releaseVersionNode,
              notesNode,
            ].filter(node => node);
          }

          return node;
        }),
      );
    }

    return transformer;
  };
}

const flatten = arr => [].concat(...arr);

function isUnreleasdHeading(node) {
  const {type, depth, children} = node;
  const firstChild = children && children[0];

  if (type !== 'heading' || depth !== 2 || !firstChild) {
    return;
  }

  return firstChild.value === 'Unreleased' || firstChild.label === 'Unreleased';
}

function isUnreleasdComment(node) {
  const {type, value} = node;
  return type === 'html' && value === '<!-- ## [Unreleased] -->';
}
