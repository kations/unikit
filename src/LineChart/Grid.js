import * as React from "react";
import { Line } from "react-native-svg";

import { useTheme } from "../styled";

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
  gridColor,
  gridDasharray,
  scale,
  ticks,
  tickValues,
  gridSize,
}) => {
  const theme = useTheme();
  const stroke = theme.colors[gridColor] || gridColor;

  var values =
      tickValues == null
        ? scale.ticks
          ? scale.ticks.apply(scale, ticks)
          : scale.domain()
        : tickValues,
    position = (scale.bandwidth ? center : number)(scale.copy());

  return values.map((value, i) => {
    return (
      <Line
        key={`grid-${i}`}
        x1="0"
        x2={width}
        y1={position(value)}
        y2={position(value)}
        strokeWidth={gridSize}
        strokeDasharray={gridDasharray}
        stroke={stroke}
      />
    );
  });

  // return lineArray.map((y, i) => {
  //   if (i === 0) return null;
  //   return (
  //     <Line
  //       key={`grid-${i}`}
  //       x1="0"
  //       x2={width}
  //       y1={y * lineGap + gridOffset}
  //       y2={y * lineGap + gridOffset}
  //       strokeWidth={0.5}
  //       strokeDasharray={gridDasharray}
  //       stroke={stroke}
  //     />
  //   );
  // });
};
