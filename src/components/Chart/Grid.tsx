import * as React from 'react';
import { Line } from 'react-native-svg';

import { useTheme, transformColor } from '../../style';

export default ({
  width,
  color = 'text:setAlpha:0.05',
  gridDasharray,
  scaleY,
  ticks = 3,
  tickValues,
  gridSize,
}) => {
  const theme = useTheme();
  const stroke = transformColor({
    value: color,
    theme,
    themeKey: 'colors',
  });
  const values = tickValues || scaleY.ticks(ticks);

  return values.map((value, i) => {
    return (
      <Line
        key={`grid-${i}`}
        x1="0"
        x2={width}
        y1={scaleY(value)}
        y2={scaleY(value)}
        strokeWidth={gridSize}
        strokeDasharray={gridDasharray}
        stroke={stroke}
      />
    );
  });
};
