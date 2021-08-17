import * as React from "react";
import Svg, { Path } from "react-native-svg";

import icons from "./icons";
import { withThemeProps, transformColor } from "../../style";
import AnimatedPath from "../AnimatedPath";
import Flex from "../Flex";

interface Props {
  theme: object;
  name: string;
  size?: number;
  color?: string;
  strokeLinecap?: string;
  strokeLinejoin?: string;
  strokeWidth?: number;
  fill?: boolean;
  animate?: boolean;
  duration?: number;
  delay?: number;
  [key: string]: any;
}

const Icon = ({
  theme,
  name = "activity",
  size = 24,
  color = "primary",
  strokeLinecap = "round",
  strokeLinejoin = "round",
  strokeWidth = 1.5,
  fill = false,
  animate = false,
  animateFillPath,
  duration,
  delay = 250,
  ...rest
}: Props) => {
  const paths = icons[name] || icons.x;
  const PathComp = React.useMemo(
    () => (animate ? AnimatedPath : Path),
    [animate]
  );
  const c1 = transformColor({ value: color, theme, themeKey: "colors" });
  const c2 = transformColor({
    value: animateFillPath,
    theme,
    themeKey: "colors",
  });
  return (
    <Flex {...rest}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 24 24`}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        fill={fill ? c1 : "transparent"}
        stroke={c1}
        strokeWidth={strokeWidth}
      >
        {animateFillPath
          ? paths.map((path, i) => {
              return <Path key={`bg-path-${name}-${i}`} d={path} stroke={c2} />;
            })
          : null}
        {paths.map((path, i) => {
          return (
            <PathComp
              key={`${name}-${i}`}
              d={path}
              duration={duration}
              delay={delay * i}
            />
          );
        })}
      </Svg>
    </Flex>
  );
};

export default withThemeProps(Icon, "Icon");
