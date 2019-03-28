import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native-web";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import Box from "../primitives/Box";

import Gradient from "./Gradient";

const AnimatedCircle = animated(View);

const Comp = props => {
  const { value, onChange, circleSize, style, ...rest } = props;

  const theme = useTheme();
  const { switcher, track, circle } = defaultStyle(props, theme);

  const [active, setActive] = useState(value || false);

  const { left } = useSpring({
    to: { left: active ? circleSize : 0 }
  });

  useEffect(() => {
    setActive(value);
  }, [value]);

  return (
    <Box
      as={TouchableOpacity}
      style={switcher}
      activeOpacity={0.8}
      circleSize={circleSize}
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
      {active && <Gradient />}
      <Box style={track}>
        <AnimatedCircle
          style={StyleSheet.flatten([
            circle,
            { transform: left.interpolate(l => [{ translateX: l }]) }
          ])}
        />
      </Box>
    </Box>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    switcher: {
      position: "relative",
      display: Platform.OS === "web" ? "inline-block" : "flex",
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
      width:
        getProp(props, theme, "circleSize", "switch") * 2 +
        getProp(props, theme, "borderSize", "switch") * 2,
      height:
        getProp(props, theme, "circleSize", "switch") +
        getProp(props, theme, "borderSize", "switch") * 2,
      padding: getProp(props, theme, "borderSize", "switch"),
      borderRadius: getProp(props, theme, "borderRadius", "switch")
    },
    track: {
      position: "relative",
      width: "100%",
      height: "100%"
    },
    circle: {
      position: "absolute",
      top: "50%",
      width: getProp(props, theme, "circleSize", "switch"),
      height: getProp(props, theme, "circleSize", "switch"),
      marginTop: -getProp(props, theme, "circleSize", "switch") / 2,
      borderRadius: getProp(props, theme, "circleSize", "switch") / 2,
      backgroundColor: "#fff"
    }
  });

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  circleSize: PropTypes.number,
  borderSize: PropTypes.number,
  onChange: PropTypes.func
};

Comp.defaultProps = {
  circleSize: 30
};

export default Comp;
