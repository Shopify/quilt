import {ReactElement, ReactPortal} from 'react';
import {Tree, Context, Visitor} from './types';
import {isPortal, isReactElement} from './identifiers';
import {ensureChild, normalizeVisit, extractContext} from './utilities';

export {Tree, Context, Visitor};

async function visitIterable(
  iter: Iterable<Tree>,
  visitor: Visitor,
  context: Context,
) {
  const promises: Promise<any>[] = [];

  for (const child of iter) {
    promises.push(visit(child, visitor, context));
  }

  await Promise.all(promises);
}

async function visitReactElement(
  el: ReactElement<any>,
  visitor: Visitor,
  context: Context,
) {
  const {instance = null, render, childContext} = normalizeVisit(el, context);

  // visit the current node
  const visitorPromise = visitor(el, instance, context, childContext);

  try {
    const children = ensureChild(render());

    if (Array.isArray(children)) {
      await visitIterable(children, visitor, childContext);
      return;
    }

    await Promise.all([visit(children, visitor, childContext), visitorPromise]);
  } catch (err) {
    // we need to wait for the current node to be visited first
    await visitorPromise;
    const children = ensureChild(render());

    if (Array.isArray(children)) {
      await visitIterable(children, visitor, childContext);
      return;
    }

    await visit(children, visitor, childContext);
  }
}

function visitPortal(portal: ReactPortal, visitor: Visitor, context: Context) {
  return visit(portal.children, visitor, context);
}

async function visit(tree: Tree, visitor: Visitor, context: Context) {
  if (!tree) {
    return;
  }

  if (Array.isArray(tree)) {
    await visitIterable(tree, visitor, context);
    return;
  }

  if (
    typeof tree === 'string' ||
    typeof tree === 'number' ||
    typeof tree === 'boolean'
  ) {
    visitor(tree, null, context);
    return;
  }

  // Support for React.createContext
  if ('type' in tree) {
    const _context = extractContext(tree);

    if (_context != null) {
      const {props} = tree;

      if ('value' in props) {
        // <Provider>
        _context._currentValue = props.value;
      }

      if (typeof props.children === 'function') {
        // <Consumer>
        const el = props.children(_context._currentValue) as Tree;
        await visit(el, visitor, context);
        return;
      }
    }
  }

  if (isReactElement(tree)) {
    await visitReactElement(tree, visitor, context);
    return;
  }

  // Support for Portals
  if (isPortal(tree)) {
    await visitPortal(tree, visitor, context);
  }
}

export {visit as traverse};
