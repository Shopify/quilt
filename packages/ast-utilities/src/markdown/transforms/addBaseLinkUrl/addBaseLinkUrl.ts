import {isAbsolute} from 'path';

import build from 'unist-builder';

export default function addBaseLinkUrl(base: string) {
  return function addBaseLinkUrlPlugin() {
    const transformer = transformLinks(base);

    return (tree) => transformer(tree);
  };
}

const transformLinks = (base) => (node) => {
  if (Array.isArray(node.children) && node.children.length > 0) {
    node.children = node.children.map(transformLinks(base)).filter((x) => x);
  }

  if (node.type === 'link' && !hasProtocol(node.url) && isAbsolute(node.url)) {
    const newLinkNode = build('link', {
      ...node,
      url: `${base}${node.url}`,
    });

    return newLinkNode;
  }

  return node;
};

const PROTOCOL_REGEX = /^(?:[a-z]+:)?\/\//i;

const hasProtocol = (url) => {
  return PROTOCOL_REGEX.test(url);
};
