import { useState, useEffect } from 'react';

/**
 * Custom hook to check if a given media query matches the current viewport.
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const getMatches = (q: string): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(q).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    const handleChange = () => setMatches(matchMedia.matches);

    handleChange(); // Set initial value
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};
