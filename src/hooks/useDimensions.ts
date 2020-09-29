import * as React from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export default function useDimensions() {
  const [dimensions, setDimensions] = React.useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

  React.useEffect(() => {
    Dimensions.addEventListener('change', onChange);

    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  return dimensions;
}
