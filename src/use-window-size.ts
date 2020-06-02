import { useEffect, useState } from 'react';

export const isClient = typeof window === 'object';

export const useWindowSize = (shouldDoCalculations: 'yes' | 'no' = 'yes') => {
  const [state, setState] = useState({
    width: isClient ? window.innerWidth : Infinity,
    height: isClient ? window.innerHeight : Infinity,
  });

  useEffect(() => {
    if (isClient && shouldDoCalculations === 'yes') {
      const handler = () => {
        setState({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }
  }, [shouldDoCalculations]);

  return state;
};
