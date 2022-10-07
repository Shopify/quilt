import {render, VNode} from 'preact';

import {Element} from './element';
import {Root} from './root';

export function createRoot(element: HTMLElement) {
  return {
    render(vnode: any) {
      return render(vnode, element);
    },
    unmount() {
      render(null, element);
    },
  };
}

export function getInternals(instance: any) {
  return instance.__v;
}

export function getComponent(vnode: VNode) {
  return (vnode as any).__c || null;
}
export function getDom(vnode: VNode) {
  return (vnode as any).__e || null;
}

export function fiberToElement(
  node: VNode,
  root: Root<unknown>,
): Element<unknown> | string {
  if (node.type === null) {
    return String(node.props);
  }

  const props = node.props;
  const children = childrenToTree(node, root);

  return new Element(
    {
      type: node.type,
      props,
      instance: getComponent(node) || getDom(node),
    },
    children,
    root,
  );
}

function getChildren(vnode: VNode) {
  return (vnode as any).__k || [];
}

export function childrenToTree(vnode: VNode | null, root: Root<unknown>) {
  const children: (string | Element<unknown>)[] = [];

  if (vnode !== null) {
    getChildren(vnode).forEach((child) => {
      if (child !== null) {
        children.push(fiberToElement(child, root));
      }
    });
  }

  return children;
}
