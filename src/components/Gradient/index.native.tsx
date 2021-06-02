import * as React from 'react';
import tc from 'tinycolor2';
import { Svg, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { withThemeProps } from '../../style';
import Flex from '../Flex';

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

interface Props {
  theme: object;
  colors: string[];
  style: object;
  deg: number;
  [key: string]: any;
}

export const Gradient = ({ colors, theme, deg = 90, ...rest }: Props) => {
  if (!colors) colors = theme.colors.gradient;
  const { parsedColors, id } = parseColors(colors, theme);
  return (
    <Flex height="100%" width="100%" overflow="hidden" {...rest}>
      <Svg height="110%" width="110%" style={{ marignLeft: '-5%' }}>
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
    </Flex>
  );
};

export default withThemeProps(Gradient, 'Gradient');
