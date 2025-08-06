import { useState, useLayoutEffect } from 'react';

/**
 * A custom React hook to get the current window size.
 * @returns An object containing the current window width and height.
 */
export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    // Set the initial size
    window.addEventListener('resize', updateSize);
    updateSize();

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return {
    width: size[0],
    height: size[1],
  };
}