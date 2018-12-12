import {
  ReactElement,
  ReactPortal,
  ComponentClass,
  Component,
  ChildContextProvider,
  ReactNode,
} from 'react';

const forwardRefSymbol = Symbol.for('react.forward_ref');
const portalSymbol = Symbol.for('react.portal');

export function isScalar(maybeScalar: ReactNode) {
  if (maybeScalar == null) {
    return true;
  }
  switch (typeof maybeScalar) {
    case 'boolean':
    case 'number':
    case 'string':
      return true;
  }
  return false;
}

export function isForwardRef(comp: ReactNode) {
  return (
    isReactElement(comp) && (comp.type as any).$$typeof === forwardRefSymbol
  );
}

export function isReactElement(
  maybeReactElement: ReactNode,
): maybeReactElement is ReactElement<any> {
  if (isScalar(maybeReactElement)) return false;
  const obj = maybeReactElement as any;
  return Boolean(obj.type);
}

export function isPortal(maybePortal: any): maybePortal is ReactPortal {
  return (
    maybePortal.containerInfo != null || maybePortal.$$typeof === portalSymbol
  );
}

export function isClassComponent(type: any): type is ComponentClass<any> {
  return Boolean(
    type.prototype &&
      (type.prototype.render ||
        type.prototype.isReactComponent ||
        type.prototype.isPureReactComponent),
  );
}

export function providesChildContext(
  instance: Component,
): instance is Component & ChildContextProvider<any> {
  return 'getChildContext' in instance;
}
