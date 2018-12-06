import {
  ReactElement,
  ReactPortal,
  ComponentClass,
  Component,
  ChildContextProvider,
} from 'react';

const forwardRefSymbol = Symbol.for('react.forward_ref');
export function isForwardRef(comp: any) {
  return comp.type && comp.type.$$typeof === forwardRefSymbol;
}

export function isReactElement(
  maybeReactElement: any,
): maybeReactElement is ReactElement<any> {
  return Boolean(maybeReactElement.type);
}

export function isPortal(maybePortal: any): maybePortal is ReactPortal {
  return (
    maybePortal.containerInfo &&
    maybePortal.children &&
    maybePortal.children.props &&
    Array.isArray(maybePortal.children.props.children)
  );
}

export function isClassComponent(type: any): type is ComponentClass<any> {
  return (
    type.prototype &&
    (type.prototype.render ||
      type.prototype.isReactComponent ||
      type.prototype.isPureReactComponent)
  );
}

export function providesChildContext(
  instance: Component,
): instance is Component & ChildContextProvider<any> {
  return instance.hasOwnProperty('getChildContext');
}
