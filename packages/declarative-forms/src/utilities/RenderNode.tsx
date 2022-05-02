import React from 'react';

import {SchemaNode, NodeChildrenMap} from '../types';
import {DebugNode} from '../debug/DebugNode';

export function renderNodes(nodes: NodeChildrenMap, uid = '') {
  const keys = Object.keys(nodes);
  return keys.map((key) => renderNode(nodes[key], `${uid}_${key}`));
}

export function renderNode(node: SchemaNode, uid = '') {
  const reactKey = `${node.uid}_${uid}`;
  let jsx: React.ReactNode[] = [];
  const nodeChildren: React.ReactNode[] = [];

  node.attributes.forEach((key) => {
    const child = node.children[key];
    if (!node.isVariant) {
      nodeChildren.push(...renderNode(child, reactKey));
    }
  });

  jsx.push(...nodeChildren);

  const {Before, After, Replace, Wrap, Pack} = node.decorator;
  const mergeProps = getPropsMerger(node);

  if (Replace) {
    const {Node, props} = Replace;
    jsx = [
      <Node key={`replace_${reactKey}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  if (Wrap) {
    const {Node, props} = Wrap;
    jsx = [
      <Node key={`wrap_${reactKey}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  if (Before) {
    const {Node, props} = Before;
    jsx.unshift(<Node key={`before_${reactKey}`} {...mergeProps(props)} />);
  }
  if (After) {
    const {Node, props} = After;
    jsx.push(<Node key={`after_${reactKey}`} {...mergeProps(props)} />);
  }

  if (node.context.sharedContext.debug) {
    jsx = [
      <DebugNode key={`debug_${reactKey}`} node={node}>
        {jsx}
      </DebugNode>,
    ];
  }

  if (Pack) {
    const {Node, props} = Pack;
    return [
      <Node key={`pack_${reactKey}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  return jsx;
}

function getPropsMerger(node: SchemaNode) {
  return (customProps: object = {}) => ({
    ...(typeof customProps === 'function' ? customProps(node) : customProps),
    node,
  });
}
