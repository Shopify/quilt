import {useState, useEffect, useLayoutEffect} from 'react';

type EffectHook = typeof useEffect | typeof useLayoutEffect;

function createUseMediaFactory(useEffectHook: EffectHook) {
  return (query: string, {initialValue}: {initialValue?: boolean} = {}) => {
    const [match, setMatch] = useState(() =>
      initialValue === undefined && typeof window !== 'undefined'
        ? window.matchMedia(query).matches
        : Boolean(initialValue),
    );

    useEffectHook(() => {
      if (!window || !window.matchMedia) {
        return;
      }

      const matchMedia = window.matchMedia(query);
      const updateMatch = (event: MediaQueryListEvent) =>
        setMatch(event.matches);

      setMatch(matchMedia.matches);

      matchMedia.addListener(updateMatch);
      return () => {
        matchMedia.removeListener(updateMatch);
      };
    }, [query]);

    return match;
  };
}

export const useMedia = createUseMediaFactory(useEffect);
export const useMediaLayout = createUseMediaFactory(useLayoutEffect);
