import {ReactElement, ReactInstance, ComponentClass} from 'react';
import {
  isClassComponent,
  isForwardRef,
  providesChildContext,
} from './identifiers';
import {Context} from './types';

interface Visit {
  render(): any;
  childContext: Context;
  instance?: ReactInstance;
}

export function extractContext(node: ReactElement<any>): Context {
  const {type} = node as any;
  return type._context || (type.Provider && type.Provider._context);
}

function configureClassInstance(
  Comp: ComponentClass<any>,
  props: any,
  context: Context,
) {
  const instance = new Comp(props, context);

  Object.defineProperty(instance, 'props', {
    value: instance.props || props,
  });
  instance.context = instance.context || context;
  // set the instance state to null (not undefined) if not set, to match React behaviour
  instance.state = instance.state || null;

  // Make the setState synchronous.
  instance.setState = newState => {
    const nextState =
      typeof newState === 'function'
        ? (newState as any)(instance.state, instance.props)
        : newState;
    instance.state = Object.assign({}, instance.state, nextState);
  };

  if (Comp.getDerivedStateFromProps) {
    const result = Comp.getDerivedStateFromProps(
      instance.props,
      instance.state,
    );
    if (result !== null) {
      instance.state = Object.assign({}, instance.state, result);
    }
  } else if (instance.UNSAFE_componentWillMount) {
    instance.UNSAFE_componentWillMount();
  } else if (instance.componentWillMount) {
    instance.componentWillMount();
  }

  return instance;
}

export function normalizeVisit(el: ReactElement<any>, context: Context): Visit {
  if (typeof el.type === 'function' || isForwardRef(el)) {
    const props = getProps(el);

    if (isForwardRef(el)) {
      return {
        render: () => (el.type as any).render(props),
        childContext: context,
      };
    }

    if (isClassComponent(el.type)) {
      const instance = configureClassInstance(el.type, props, context);
      return {
        render: () => instance.render(),
        childContext: providesChildContext(instance)
          ? Object.assign({}, context, instance.getChildContext())
          : context,
        instance,
      };
    }

    return {
      render: () => (el.type as Function)(props),
      childContext: context,
    };
  }

  return {
    render: () => el.props && el.props.children,
    childContext: context,
  };
}

function getProps(el: ReactElement<any>) {
  const Component = el.type;
  return Object.assign(
    {},
    (Component as Exclude<typeof Component, string>).defaultProps,
    el.props,
  );
}

export function ensureChild(child: any) {
  return child && typeof child.render === 'function'
    ? ensureChild(child.render())
    : child;
}
