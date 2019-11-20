/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useRef, useEffect, Ref} from 'react';

import {isSupported} from './utilities';
import {UnsupportedBehavior} from './types';

interface Options {
  root?: Element | string | null;
  rootMargin?: string;
  threshold?: number | number[];
  children?: React.ReactNode;
  wrapperComponent?: string;
  unsupportedBehavior?: UnsupportedBehavior;
}

const emptyBoundingClientRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
};

export function useIntersection({
  root,
  rootMargin,
  threshold,
  unsupportedBehavior = UnsupportedBehavior.TreatAsIntersecting,
}: Options = {}): [IntersectionObserverEntry, Ref<HTMLElement | null>] {
  const node = useRef<HTMLElement | null>(null);
  const lastNode = useRef<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastObserver = useRef<IntersectionObserver | null>(null);

  const [intersectionEntry, setIntersectingEntry] = useState<
    IntersectionObserverEntry
  >(() => ({
    boundingClientRect: emptyBoundingClientRect,
    intersectionRatio: 0,
    intersectionRect: emptyBoundingClientRect,
    isIntersecting: false,
    rootBounds: emptyBoundingClientRect,
    target: null as any,
    time: Date.now(),
  }));

  useEffect(() => {
    if (!isSupported()) {
      return;
    }

    const resolvedRoot =
      typeof root === 'string' ? document.querySelector(root) : root;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIntersectingEntry(entry),
      {
        root: resolvedRoot,
        rootMargin,
        threshold,
      },
    );

    observer.current = intersectionObserver;

    return () => {
      intersectionObserver.disconnect();
    };
  }, [
    root,
    rootMargin,
    Array.isArray(threshold) ? threshold.join() : threshold,
  ]);

  useEffect(() => {
    if (
      lastNode.current === node.current &&
      lastObserver.current === observer.current
    ) {
      return;
    }

    lastNode.current = node.current;

    if (node.current == null) {
      return;
    }

    if (
      !isSupported() &&
      unsupportedBehavior === UnsupportedBehavior.TreatAsIntersecting
    ) {
      const boundingClientRect = node.current.getBoundingClientRect();

      setIntersectingEntry({
        boundingClientRect,
        intersectionRatio: 1,
        intersectionRect: boundingClientRect,
        isIntersecting: true,
        rootBounds: boundingClientRect,
        target: node.current,
        time: Date.now(),
      });

      return;
    }

    if (observer.current != null) {
      lastObserver.current = observer.current;
      observer.current.observe(node.current);
    }

    return () => {
      if (
        lastNode.current == null ||
        lastObserver.current == null ||
        (lastNode.current === node.current &&
          lastObserver.current === observer.current)
      ) {
        return;
      }

      lastObserver.current.unobserve(lastNode.current);
    };
  });

  return [intersectionEntry, node];
}

export function useValueTracking<T>(
  value: T,
  onChange: (value: T, oldValue: T) => void,
) {
  const tracked = useRef(value);
  const oldValue = tracked.current;

  if (value !== oldValue) {
    tracked.current = value;
    onChange(value, oldValue);
  }
}
/* eslint-enable react-hooks/exhaustive-deps */
