import * as React from 'react';
import { Rect } from 'react-native-svg';

import { useTheme, transformColor } from '../../style';

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
