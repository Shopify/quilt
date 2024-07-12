import {useState, useEffect, useLayoutEffect} from 'react';

type EffectHook = typeof useEffect | typeof useLayoutEffect;
type Query = string;
type EventListener = (event: {matches: boolean}) => void;
type Callback = (matches: boolean) => void;

const hookCallbacks: {
  [x: Query]: {
    callbacks: Set<Callback>;
    eventListener: EventListener;
    matchMedia: MediaQueryList;
  };
} = {};

function createUseMediaFactory(useEffectHook: EffectHook) {
  return (query: Query) => {
    const [match, setMatch] = useState(false);

    useEffectHook(() => {
      if (!window || !window.matchMedia) {
        return;
      }

      // First time we've seen this media query
      if (!hookCallbacks[query]) {
        hookCallbacks[query] = {
          // Each of these callbacks will be executed in order when the event
          // fires
          callbacks: new Set<Callback>(),
          // Will use .matches for subsequent hook calls referencing the same
          // query so their initial (client) state is updated correctly.
          matchMedia: window.matchMedia(query),

          // Setup the event listener for this query
          eventListener: (event: {matches: boolean}) => {
            for (const hookCallback of hookCallbacks[query].callbacks) {
              // Don't allow earlier handlers to block later handlers if they
              // throw an error
              try {
                hookCallback(event.matches);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
              }
            }
          },
        };

        // Connect event listener to window events
        hookCallbacks[query].matchMedia.addListener(
          hookCallbacks[query].eventListener,
        );
      }

      // Update state when the media query changes
      hookCallbacks[query].callbacks.add(setMatch);

      // Set the state once when useEffect is called
      setMatch(hookCallbacks[query].matchMedia.matches);

      return () => {
        // Don't listen to this query anymore
        hookCallbacks[query].callbacks.delete(setMatch);

        // Clean up: If there's no one interested in this query anymore, remove
        // the event listener from the window.
        if (hookCallbacks[query].callbacks.size === 0) {
          hookCallbacks[query].matchMedia.removeListener(
            hookCallbacks[query].eventListener,
          );
          delete hookCallbacks[query];
        }
      };
    }, [query]);

    return match;
  };
}

export const useMedia = createUseMediaFactory(useEffect);
export const useMediaLayout = createUseMediaFactory(useLayoutEffect);
