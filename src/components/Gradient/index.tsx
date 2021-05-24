import * as React from 'react';
import tc from 'tinycolor2';
import { Svg, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { withThemeProps } from '../../style';

const parseColors = (colors, theme) => {
  const parsedColors = [];
  let id = '';
  colors.map((c) => {
    const color = theme.colors[c] || c;
    const obj = {
      color:
        color === 'transparent' ? color : tc(color).setAlpha(1).toHexString(),
      alpha: tc(color).getAlpha(),
    };
    parsedColors.push(obj);
    id += obj.color;
  });
  return { parsedColors, id };
};

const Gradient = ({ colors, theme, ...rest }) => {
  if (!colors) colors = theme.colors.gradient;
  const { parsedColors, id } = parseColors(colors, theme);
  return (
    <Svg height="100%" width="100%" {...rest}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          {parsedColors.map((c, i) => {
            return (
              <Stop
                offset={i}
                key={`stop-${i}`}
                stopColor={c.color}
                stopOpacity={c.alpha}
              />
            );
          })}
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
};

export default withThemeProps(Gradient);
