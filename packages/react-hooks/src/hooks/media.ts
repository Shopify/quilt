import {useState, useEffect} from 'react';

export function useMedia(query: string) {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    if (!window || !window.matchMedia) {
      return;
    }

    const matchMedia = window.matchMedia(query);
    const updateMatch = (event: MediaQueryListEvent) => setMatch(event.matches);

    setMatch(matchMedia.matches);

    matchMedia.addListener(updateMatch);
    return () => {
      matchMedia.removeListener(updateMatch);
    };
  }, [query]);

  return match;
}
