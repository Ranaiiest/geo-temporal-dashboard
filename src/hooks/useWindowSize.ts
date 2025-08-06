import { useState, useLayoutEffect } from 'react';

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