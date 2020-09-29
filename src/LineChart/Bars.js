import * as React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { Rect, G } from "react-native-svg";
import { scaleBand } from "d3-scale";

import { useTheme } from "../styled";
import { Animated, useSpring } from "../Spring";
import { isNumber } from "../util";

const AnimatedBar = Animated.createAnimatedComponent(Rect);

const Delay = ({ children, delay }) => {
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setWaiting(false);
    }, delay);
  }, []);
  if (waiting) return null;
  return children;
};

const Bar = ({ height, springConfig = {}, delay = 0, onPress, ...rest }) => {
  const y = useSpring({
    from: height,
    to: 0,
    config: springConfig,
  });
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <AnimatedBar
        {...rest}
        height={height}
        style={{ transform: [{ translateY: y }] }}
      />
    </TouchableWithoutFeedback>
  );
};

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
  gradientColor = "primary",
  strokeWidth = 1,
  shadow = 4,
  shadowOpacity = 0.2,
  strokeDasharray,
  progress = 1,
  dots,
  opacity,
  paddding = 0.1,
  ...rest
}) => {
  const theme = useTheme();
  const stroke = theme.colors[color] || color;

  const x = scaleBand()
    .domain([...Array(data.length).keys()])
    .range([0, width])
    .padding(paddding);

  console.log({ width, range: [...Array(data.length).keys()] });

  return (
    <G style={{ overflow: "hidden" }}>
      {data.map((d, i) => {
        console.log({ x: x(i), y: scaleY(d[objKey] || d || 0) });
        const v = d[objKey] || d || 0;
        console.log({ v });
        const scale = scaleY(isNumber(v) ? v : 0);
        return (
          <Delay delay={i * (1000 / data.length)}>
            <Bar
              key={i}
              x={x(i)}
              y={scale}
              width={x.bandwidth()}
              height={scaleY(0) - scale}
              fill={stroke}
              stroke="transparent"
              opacity={opacity}
              onPress={() => {
                alert(d[objKey] || d);
              }}
            />
          </Delay>
        );
      })}
    </G>
  );
};
