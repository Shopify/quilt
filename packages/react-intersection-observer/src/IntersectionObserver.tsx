import * as React from 'react';
import {isSupported} from './utilities';

export enum UnsupportedBehavior {
  Ignore,
  TreatAsIntersecting,
}

interface Props {
  root?: Element | string | null;
  rootMargin?: string;
  element?: string;
  threshold?: number | number[];
  children?: React.ReactNode;
  unsupportedBehavior?: UnsupportedBehavior;
  onIntersecting?(entries: IntersectionObserverEntry): void;
  onNotIntersecting?(entries: IntersectionObserverEntry): void;
}

export default class IntersectionObserverDom extends React.Component<Props> {
  private element = React.createRef<HTMLElement>();
  private observer?: IntersectionObserver;

  componentDidMount() {
    this.observe();
  }

  shouldComponentUpdate(nextProps: Props) {
    // If any of the values required to construct an IntersectionObserver
    // change, we need to disconnect it altogether. If only the callbacks changed,
    // we can skip doing anything at all, because they are already dynamically
    // looked up in the IntersectionObserver callback.
    return (
      nextProps.root !== this.props.root ||
      nextProps.rootMargin !== this.props.rootMargin ||
      nextProps.element !== this.props.element ||
      nextProps.children !== this.props.children ||
      !equalThresholds(nextProps.threshold, this.props.threshold)
    );
  }

  componentDidUpdate() {
    this.disconnect();
    this.observe();
  }

  componentWillUnmount() {
    this.disconnect();
  }

  render() {
    const {element: Element = 'div' as any, children} = this.props;
    return (
      <Element style={{display: 'contents'}} ref={this.element}>
        {children}
      </Element>
    );
  }

  private disconnect() {
    const {observer} = this;

    if (observer != null) {
      observer.disconnect();
      this.observer = undefined;
    }
  }

  private observe() {
    const {props, element} = this;

    if (element.current == null) {
      return;
    }

    if (!isSupported()) {
      const {
        unsupportedBehavior = UnsupportedBehavior.TreatAsIntersecting,
        onIntersecting,
      } = props;

      if (
        unsupportedBehavior === UnsupportedBehavior.TreatAsIntersecting &&
        onIntersecting != null
      ) {
        const boundingClientRect = element.current.getBoundingClientRect();

        onIntersecting({
          boundingClientRect,
          intersectionRatio: 1,
          intersectionRect: boundingClientRect,
          isIntersecting: true,
          rootBounds: boundingClientRect,
          target: element.current,
          time: Date.now(),
        });
      }

      return;
    }

    this.observer = observe(
      element.current,
      this.intersectionObserverCallback,
      props,
    );
  }

  private intersectionObserverCallback = ([
    intersectionEntry,
  ]: IntersectionObserverEntry[]) => {
    const {onIntersecting, onNotIntersecting} = this.props;

    if (intersectionEntry.intersectionRatio > 0) {
      if (onIntersecting) {
        onIntersecting(intersectionEntry);
      }
    } else if (onNotIntersecting) {
      onNotIntersecting(intersectionEntry);
    }
  };
}

function observe(
  element: HTMLElement,
  callback: IntersectionObserverCallback,
  {
    root,
    rootMargin,
    threshold,
  }: Pick<Props, 'root' | 'rootMargin' | 'threshold'>,
) {
  const resolvedRoot =
    typeof root === 'string' ? document.querySelector(root) : root;

  const observer = new IntersectionObserver(callback, {
    root: resolvedRoot,
    rootMargin,
    threshold,
  });

  observer.observe(element);
  return observer;
}

function equalThresholds(
  oldThreshold: Props['threshold'],
  newThreshold: Props['threshold'],
) {
  return (
    oldThreshold === newThreshold ||
    (Array.isArray(oldThreshold) &&
      Array.isArray(newThreshold) &&
      oldThreshold.length === newThreshold.length &&
      oldThreshold.every((item, index) => item === newThreshold[index]))
  );
}
