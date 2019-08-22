import * as React from 'react';
import {useIntersection, useValueTracking} from './hooks';
import {UnsupportedBehavior} from './types';

interface Props {
  root?: Element | string | null;
  rootMargin?: string;
  threshold?: number | number[];
  children?: React.ReactNode;
  wrapperComponent?: string;
  unsupportedBehavior?: UnsupportedBehavior;
  onIntersectionChange(entry: IntersectionObserverEntry): void;
}

export const IntersectionObserver = React.memo(function IntersectionObserver({
  children,
  root,
  rootMargin,
  threshold,
  unsupportedBehavior,
  wrapperComponent: Wrapper = 'div',
  onIntersectionChange,
}: Props) {
  const [intersection, ref] = useIntersection({
    root,
    rootMargin,
    threshold,
    unsupportedBehavior,
  });

  useValueTracking(intersection, newValue => onIntersectionChange(newValue));

  return React.createElement(Wrapper, {ref}, children);
});
