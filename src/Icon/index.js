import React from "react";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

import styled from "../styled";
import Box from "../Box";

const Icon = styled(Box)(({ size }) => ({
  position: "relative",
  width: size,
  height: size
}));

const Line = animated(
  styled.View(({ color, lineWidth }) => ({
    position: "absolute",
    backgroundColor: color,
    height: lineWidth
  }))
);

const first = {
  x: {
    rotate: 45,
    width: 100,
    top: 50,
    left: 0
  },
  arrowDown: { rotate: 45, width: 50, top: 50, left: 7 },
  arrowTop: { rotate: -45, width: 50, top: 50, left: 7 },
  plus: {
    rotate: 90,
    width: 100,
    left: 0,
    top: 50
  },
  minus: {
    width: 100,
    left: 0,
    top: 50,
    rotate: 0
  },
  burger: {
    width: 100,
    left: 0,
    top: 35,
    rotate: 0
  }
};

const sec = {
  x: {
    rotate: -45,
    width: 100,
    top: 50,
    left: 0
  },
  arrowDown: { rotate: -45, width: 50, top: 50, left: 40 },
  arrowTop: { rotate: 45, width: 50, top: 50, left: 40 },
  plus: {
    width: 100,
    left: 0,
    top: 50,
    rotate: 0
  },
  burger: {
    width: 100,
    left: 0,
    top: 65,
    rotate: 0
  }
};

const Comp = ({
  size = 44,
  lineWidth = 2,
  name = "x",
  onPress,
  color = "primary",
  ...rest
}) => {
  const firstStyle = useSpring({
    to: first[name]
  });

  const secStyle = useSpring({
    to: sec[name]
  });

  if (!first[name]) {
    return null;
  }

  return (
    <Icon
      as={onPress ? TouchableOpacity : undefined}
      onPress={onPress || null}
      activeOpacity={onPress ? 0.8 : undefined}
      size={size}
      {...rest}
    >
      <Line
        position="absolute"
        color={color}
        lineWidth={lineWidth}
        style={{
          left: firstStyle.left.interpolate(l => `${l}%`),
          top: firstStyle.top.interpolate(l => `${l}%`),
          width: firstStyle.width.interpolate(l => `${l}%`),
          transform: firstStyle.rotate.interpolate(l => [{ rotate: `${l}deg` }])
        }}
      />
      {["minus"].indexOf(name) > -1 ? null : (
        <Line
          position="absolute"
          color={color}
          lineWidth={lineWidth}
          style={{
            left: secStyle.left.interpolate(l => `${l}%`),
            top: secStyle.top.interpolate(l => `${l}%`),
            width: secStyle.width.interpolate(l => `${l}%`),
            transform: secStyle.rotate.interpolate(l => [{ rotate: `${l}deg` }])
          }}
        />
      )}
    </Icon>
  );
};

export default Comp;
