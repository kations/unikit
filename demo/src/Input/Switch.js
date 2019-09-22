import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { TouchableOpacity, Platform } from "react-native";

import styled, { useTheme } from "../styled";
import Box from "../Box";

const Switch = animated(
  styled(Box)(({ size, radius, gap }) => ({
    position: "relative",
    display: Platform.OS === "web" ? "inline-block" : "flex",
    overflow: "hidden",
    width: size * 2 - gap,
    height: size,
    padding: gap,
    borderRadius: radius || size,
    margin: 0
  }))
);

const Track = styled.View({
  position: "relative",
  width: "100%",
  height: "100%"
});

const Circle = animated(
  styled(Box)(({ size, radius, gap }) => ({
    position: "absolute",
    top: 0,
    width: size - gap * 2,
    height: size - gap * 2,
    borderRadius: radius ? radius - gap / 2 : size,
    backgroundColor: "#fff"
  }))
);

const Comp = ({
  value,
  onChange,
  size = 40,
  radius,
  gap = 5,
  style,
  trackColor = "background",
  activeTrackColor = "primary",
  ...rest
}) => {
  const theme = useTheme();

  const [active, setActive] = useState(value || false);

  const { left, backgroundColor } = useSpring({
    to: {
      left: active ? size - gap : 0,
      backgroundColor: active
        ? theme.colors[activeTrackColor] || activeTrackColor
        : theme.colors[trackColor] || trackColor
    },
    config: { duration: 300 }
  });

  useEffect(() => {
    setActive(value);
  }, [value]);

  // TODO: add hover effect
  // onMouseEnter={() => console.log("hover")}
  // onMouseLeave={() => }

  return (
    <Switch
      as={TouchableOpacity}
      style={{ ...style, backgroundColor: backgroundColor }}
      activeOpacity={0.8}
      size={size}
      radius={radius}
      gap={gap}
      onPress={() => {
        const newValue = !active;
        setActive(newValue);
        setTimeout(() => {
          if (onChange) {
            onChange(newValue);
          }
        }, 299);
      }}
      {...rest}
    >
      <Track>
        <Circle
          style={{ transform: [{ translateX: left }] }}
          size={size}
          radius={radius}
          gap={gap}
          shadow={5}
        />
      </Track>
    </Switch>
  );
};

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  circleSize: PropTypes.number,
  borderSize: PropTypes.number,
  onChange: PropTypes.func
};

export default Comp;
