import * as React from 'react';
import { Line } from 'react-native-svg';

import { useTheme, transformColor } from '../../style';

export default ({
  value,
  width,
  color = 'text:setAlpha:0.05',
  gridDasharray,
  scaleY,
  size = 1,
}) => {
  const theme = useTheme();
  const stroke = transformColor({
    value: color,
    theme,
    themeKey: 'colors',
  });

  return (
    <Line
      x1="0"
      x2={width}
      y1={scaleY(value)}
      y2={scaleY(value)}
      strokeWidth={size}
      strokeDasharray={gridDasharray}
      stroke={stroke}
    />
  );
};
