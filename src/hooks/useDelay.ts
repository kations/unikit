import * as React from 'react';

export default function useDelay(delay: number) {
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setWaiting(false);
    }, delay);
  }, []);

  return { waiting };
}
