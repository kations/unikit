import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native-web";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import Box from "../primitives/Box";
import Flex from "../primitives/Flex";

const Line = animated(Box);

const first = {
  x: {
    rotate: 45,
    width: 100,
    top: 50
  }
};

const sec = {
  x: {
    rotate: -45,
    width: 100,
    top: 50
  }
};

const Comp = props => {
  const { name, onPress, ...rest } = props;

  const theme = useTheme();
  const { icon } = defaultStyle(props, theme);

  const firstStyle = useSpring({
    to: first[name]
  });

  const secStyle = useSpring({
    to: sec[name]
  });

  return (
    <Flex
      as={onPress ? TouchableOpacity : undefined}
      onPress={onPress || null}
      style={icon}
      activeOpacity={onPress ? 0.8 : undefined}
      {...rest}
    >
      <Line
        position="absolute"
        height={getProp(props, theme, "lineWidth", "icon")}
        backgroundColor={getProp(props, theme, "color", "icon")}
        style={{
          top: firstStyle.top.interpolate(l => `${l}%`),
          width: firstStyle.width.interpolate(l => `${l}%`),
          transform: firstStyle.rotate.interpolate(l => [{ rotate: `${l}deg` }])
        }}
      />
      <Line
        position="absolute"
        height={getProp(props, theme, "lineWidth", "icon")}
        backgroundColor={getProp(props, theme, "color", "icon")}
        style={{
          top: secStyle.top.interpolate(l => `${l}%`),
          width: secStyle.width.interpolate(l => `${l}%`),
          transform: secStyle.rotate.interpolate(l => [{ rotate: `${l}deg` }])
        }}
      />
    </Flex>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    icon: {
      width: getProp(props, theme, "size", "icon"),
      height: getProp(props, theme, "size", "icon")
    }
  });

Comp.defaultProps = {
  name: "x",
  size: 44,
  lineWidth: 2,
  color: "primary"
};

export default Comp;
