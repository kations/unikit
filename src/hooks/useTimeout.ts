import * as React from 'react';

const useTimeout = (
  callback: () => void, // function to call. No args passed.
  // if you create a new callback each render, then previous callback will be cancelled on render.
  timeout: number = 0 // delay, ms (default: immediately put into JS Event Queue)
): (() => void) => {
  const timeoutIdRef = React.useRef<NodeJS.Timeout>();
  const cancel = React.useCallback(() => {
    const timeoutId = timeoutIdRef.current;
    if (timeoutId) {
      timeoutIdRef.current = undefined;
      clearTimeout(timeoutId);
    }
  }, [timeoutIdRef]);

  React.useEffect(() => {
    if (timeout) {
      timeoutIdRef.current = setTimeout(callback, timeout);
    }
    return cancel;
  }, [callback, timeout, cancel]);

  return cancel;
};

export default useTimeout;
