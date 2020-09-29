import * as React from "react";
import { Line } from "react-native-svg";

import { useTheme } from "../styled";

export default ({ height, width, gridColor, gridDasharray, scaleY }) => {
  const theme = useTheme();
  const stroke = theme.colors[gridColor] || gridColor;

  return (
    <Line
      x1="0"
      x2={width}
      y1={scaleY(0)}
      y2={scaleY(0)}
      strokeWidth={0.5}
      strokeDasharray={gridDasharray}
      stroke={stroke}
    />
  );
};
