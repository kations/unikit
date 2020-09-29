import * as React from 'react';
import { Line, Rect } from 'react-native-svg';

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
  height,
  width,
  color = 'text:setAlpha:0.05',
  pan,
  size,
  progress,
  offset,
}) => {
  const theme = useTheme();
  if (!pan) return null;
  const stroke = transformColor({
    value: color,
    theme,
    themeKey: 'colors',
  });

  const w = size || offset || 1;

  return (
    <Rect
      x={progress * (width - offset)}
      y={0}
      width={w}
      height={height}
      fill={stroke}
    />
  );
};
