import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import Svg, { Path, Polyline } from "swgs";
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

const Comp = ({
  size = 44,
  width = 1.5,
  lineCap = "round",
  fill = false,
  name = "x",
  onPress,
  color = "primary",
  animate = true,
  animateOpacity = false,
  springConfig = { config: { duration: 750 } },
  ...rest
}) => {
  const [icon, setIcon] = useState(icons[name] || icons["x"]);
  const strokeDasharray = new svgPathProperties(icon).getTotalLength();

  const prev = usePrevious(icon);
  const theme = useTheme();
  const springProps = useSpring({
    from: { t: strokeDasharray, opacity: 0 },
    to: { t: 0, opacity: 1 },
    reset: prev !== icon,
    ...springConfig
  });

  useEffect(() => {
    setIcon(icons[name]);
  }, [name]);

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
        <AnimatedPath
          d={icon}
          scale={size / 24}
          strokeWidth={width}
          strokeLinecap={lineCap}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={animate ? springProps.t : 0}
          fill="transparent"
          style={{
            fill: fill ? theme.colors[color] || color : "transparent",
            stroke: theme.colors[color] || color,
            opacity: animateOpacity ? springProps.opacity : 1
          }}
        />
      </Svg>
    </Icon>
  );
};

export default withThemeProps(Comp, "Icon");
