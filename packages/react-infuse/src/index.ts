import {ReactElement, ReactPortal} from 'react';
import {Tree, Context, Infuser} from './types';
import {isPortal, isReactElement} from './identifiers';
import {ensureChild, normalizeVisit, extractContext} from './utilities';

export {Tree, Context, Infuser};

async function infuseIterable(
  iter: Iterable<Tree>,
  infuser: Infuser,
  context: Context,
) {
  const promises: Promise<any>[] = [];

  for (const child of iter) {
    promises.push(infuse(child, infuser, context));
  }

  await Promise.all(promises);
}

async function infuseReactElement(
  el: ReactElement<any>,
  infuser: Infuser,
  context: Context,
) {
  const {instance = null, render, childContext} = normalizeVisit(el, context);

  // infuse the current node
  const infused = await infuser(el, instance, context, childContext);

  if (infused === false) {
    // return false to skip render traversal
    return;
  }

  const children = ensureChild(render());

  if (Array.isArray(children)) {
    await infuseIterable(children, infuser, childContext);
    return;
  }

  await infuse(children, infuser, childContext);
}

function infusePortal(portal: ReactPortal, infuser: Infuser, context: Context) {
  return Promise.all(
    (portal.children as ReactElement<any>).props.children.map(child =>
      infuse(child, infuser, context),
    ),
  );
}

export async function infuse(tree: Tree, infuser: Infuser, context: Context) {
  if (!tree) {
    return;
  }

  if (Array.isArray(tree)) {
    await infuseIterable(tree, infuser, context);
    return;
  }

  if (typeof tree === 'string' || typeof tree === 'number') {
    infuser(tree, null, context);
    return;
  }

  // Support for React.createContext
  if (tree.hasOwnProperty('type')) {
    const _context = extractContext(tree);

    if (_context != null) {
      if ('value' in tree.props) {
        // <Provider>
        _context._currentValue = tree.props.value;
      }

      if (typeof tree.props.children === 'function') {
        // <Consumer>
        const el = tree.props.children(_context._currentValue) as Tree;
        await infuse(el, infuser, context);
        return;
      }
    }
  }

  if (isReactElement(tree)) {
    await infuseReactElement(tree, infuser, context);
    return;
  }

  // Support for Portals
  if (isPortal(tree)) {
    await infusePortal(tree, infuser, context);
  }
}
