import * as React from 'react';

export default function useInterval(
  callback: any,
  delay: number,
  ...args: any
) {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current(...args);
      }
    }
    if (delay !== null && delay !== undefined) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
