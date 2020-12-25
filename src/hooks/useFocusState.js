import { useState } from 'react';

const useFocusState = ({ autoFocus = false }) => {
  const [isFocused, setFocus] = useState(autoFocus);

  return {
    isFocused,
    onBlur: () => {
      setFocus(false);
    },
    onFocus: () => {
      setFocus(true);
    },
  };
};

export default useFocusState;
