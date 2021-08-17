import * as React from "react";
import tc from "tinycolor2";
import { Svg, Defs, LinearGradient, Stop, Rect } from "react-native-svg";

import { withThemeProps } from "../../style";
import { getProgress } from "../../util";
import Flex from "../Flex";
import degree from "./deg";

const parseColors = (colors, theme, deg) => {
  const parsedColors = [];
  let id = "";
  colors.map((c) => {
    const color = theme.colors[c] || c;
    const obj = {
      color:
        color === "transparent" ? color : tc(color).setAlpha(1).toHexString(),
      alpha: tc(color).getAlpha(),
    };
    parsedColors.push(obj);
    id += obj.color;
  });
  id += deg;
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
  const { parsedColors, id } = parseColors(colors, theme, deg);
  return (
    <Flex height="100%" width="100%" overflow="hidden" {...rest}>
      <Svg height="110%" width="110%" style={{ marignLeft: "-5%" }}>
        <Defs>
          <LinearGradient id={id} {...degree(deg)}>
            {parsedColors.map((c, i) => {
              return (
                <Stop
                  offset={getProgress(0, parsedColors.length, i)}
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

export default withThemeProps(Gradient, "Gradient");
