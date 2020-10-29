import {
  getValueForScreenSize,
  isResponsiveObjectValue,
} from '../responsiveHelpers';

import useDimensions from './useDimensions';
import useTheme from './useTheme';

const useResponsiveProp = (propValue) => {
  const theme = useTheme();
  const dimensions = useDimensions();

  return isResponsiveObjectValue(propValue, theme)
    ? getValueForScreenSize({
        responsiveValue: propValue,
        breakpoints: theme.breakpoints,
        dimensions,
      })
    : propValue;
};

export default useResponsiveProp;
