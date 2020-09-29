import * as React from 'react';
import { Line } from 'react-native-svg';

import { useTheme, transformColor } from '../../restyle';

function number(scale) {
  return function (d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function (d) {
    return +scale(d) + offset;
  };
}

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
