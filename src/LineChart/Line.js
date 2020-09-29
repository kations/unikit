import * as React from "react";
import { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import * as shape from "d3-shape";

import AnimatedPath from "./AnimatedPath";
import { useTheme } from "../styled";
import { isNumber } from "../util";

export default ({
  data,
  scaleX,
  scaleY,
  objKey,
  width,
  height,
  animated = true,
  color = "primary",
  fill,
  gradient = true,
  gradientColor,
  strokeWidth = 1,
  shadow = 4,
  shadowOpacity = 0.2,
  strokeDasharray,
  progress = 1,
  dots,
  curve,
  gradientOpacity = 1,
  gradientStartColor,
  gradientStopColor,
  ...rest
}) => {
  const theme = useTheme();
  const stroke = theme.colors[color] || color;
  const gColor = theme.colors[gradientColor] || gradientColor || stroke;
  const fillColor = fill ? theme.colors[fill] || fill : undefined;
  const PathComp = animated ? AnimatedPath : Path;

  const d = shape
    .line()
    .x((p, i) => scaleX(i))
    .y((p) => {
      const v = p[objKey] || p || 0;
      return scaleY(isNumber(v) ? v : 0);
    })
    .curve(curve)(data);

  return (
    <>
      {gradient || fill ? (
        <>
          <Defs key={stroke}>
            <LinearGradient
              id={`gradient-${color}`}
              x1={"0%"}
              y1={"0%"}
              x2={"0%"}
              y2={fill || gradientStartColor ? "100%" : "80%"}
            >
              <Stop
                offset={"0%"}
                stopColor={gradientStartColor || fillColor || gColor}
                stopOpacity={fill || gradientStartColor ? gradientOpacity : 0.2}
              />
              <Stop
                offset={"100%"}
                stopColor={gradientStopColor || fillColor || gColor}
                stopOpacity={fill || gradientStopColor ? gradientOpacity : 0}
              />
            </LinearGradient>
          </Defs>
          <Path
            d={`${d}L ${width} ${height} L 0 ${height}`}
            fill={`url(#${`gradient-${color}`})`}
          />
        </>
      ) : null}
      {shadow && shadow > 0 ? (
        <PathComp
          y={strokeWidth > 1 ? strokeWidth : 2}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          d={d}
          strokeWidth={shadow}
          fill={"transparent"}
          style={{ opacity: shadowOpacity }}
        />
      ) : null}
      <PathComp
        fill="transparent"
        stroke={stroke}
        {...{ d, strokeWidth, strokeDasharray }}
      />
    </>
  );
};
