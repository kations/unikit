import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring/native";
import t from "prop-types";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "swgs";
import { svgPathProperties } from "svg-path-properties";

import styled, { useTheme, withThemeProps } from "../styled";
import Box from "../Box";
import { usePrevious } from "../hooks";
import icons from "./icons";

const Icon = styled(Box)(({ size }) => ({
  position: "relative",
  width: size,
  height: size
}));

const AnimatedPath = animated(Path);

export function Comp({
  size = 44,
  strokeWidth = 1.5,
  lineCap = "round",
  fill = false,
  name = "x",
  color = "primary",
  animate = false,
  withBg = true,
  springConfig = { config: { duration: 750 } },
  onPress,
  ...rest
}) {
  const [icon, setIcon] = useState(icons[name] || icons["x"]);
  const strokeDasharray = new svgPathProperties(icon).getTotalLength();

  const prev = usePrevious(icon);
  const theme = useTheme();
  const springProps = animate
    ? useSpring({
        from: { t: strokeDasharray, opacity: 0 },
        to: { t: 0, opacity: 1 },
        reset: prev !== icon,
        ...springConfig
      })
    : null;

  useEffect(() => {
    setIcon(icons[name]);
  }, [name]);

  const iconProps = animate
    ? { strokeDasharray: strokeDasharray, strokeDashoffset: springProps.t }
    : {};

  return (
    <Icon
      as={onPress ? TouchableOpacity : undefined}
      onPress={onPress || null}
      activeOpacity={onPress ? 0.8 : undefined}
      size={size}
      {...rest}
    >
      <Svg
        width={size}
        height={size}
        style={{ backgroundColor: "transparent" }}
      >
        {animate && withBg ? (
          <Path
            d={icon}
            scale={size / 24}
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
            style={{
              stroke: theme.colors[color] || color,
              fill: "transparent",
              opacity: 0.2
            }}
          />
        ) : null}
        <AnimatedPath
          d={icon}
          scale={size / 24}
          strokeWidth={strokeWidth}
          strokeLinecap={lineCap}
          {...iconProps}
          fill="transparent"
          style={{
            fill: fill ? theme.colors[color] || color : "transparent",
            stroke: theme.colors[color] || color
          }}
        />
      </Svg>
    </Icon>
  );
}

Comp.propTypes = {
  size: t.number,
  strokeWidth: t.number,
  lineCap: t.string,
  fill: t.bool,
  name: t.string,
  color: t.string,
  animate: t.bool,
  /** Show a faded stroke if animate */
  withBg: t.bool,
  animateOpacity: t.bool,
  springConfig: t.object,
  onPress: t.func
};

export default withThemeProps(Comp, "Icon");
