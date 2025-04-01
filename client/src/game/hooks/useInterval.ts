import { useEffect, useRef } from 'react';

/**
 * Custom hook for setting intervals that can be dynamically updated.
 * 
 * @param callback Function to be called at each interval
 * @param delay Time in milliseconds between calls, or null to pause
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    
    // Only set up an interval if delay is defined and greater than 0
    if (delay !== null && delay > 0) {
      const id = setInterval(tick, delay);
      // Clear the interval when component unmounts or delay changes
      return () => clearInterval(id);
    }
    
    // If delay is null, don't set up an interval
    return undefined;
  }, [delay]);
}
