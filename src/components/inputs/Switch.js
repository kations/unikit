import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import Box from "../primitives/Box";

import Gradient from "../ui/Gradient";

const Active = animated(Box);
const Circle = animated(Box);

const Comp = props => {
  const { value, onChange, circleSize, style, ...rest } = props;

  const theme = useTheme();
  const { switcher, track, circle } = defaultStyle(props, theme);

  const [active, setActive] = useState(value || false);

  const { left, backgroundColor } = useSpring({
    to: {
      left: active ? circleSize : 0,
      backgroundColor: active
        ? getProp(props, theme, "activeBackground", "switch")
        : getProp(props, theme, "backgroundColor", "switch")
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
    <Active
      as={TouchableOpacity}
      style={StyleSheet.flatten([
        switcher,
        { backgroundColor: backgroundColor }
      ])}
      activeOpacity={0.8}
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
      <Box style={track}>
        <Circle
          style={StyleSheet.flatten([
            circle,
            { transform: [{ translateX: left }] }
          ])}
          shadow={5}
        />
      </Box>
    </Active>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    switcher: {
      position: "relative",
      display: Platform.OS === "web" ? "inline-block" : "flex",
      backgroundColor: getProp(props, theme, "backgroundColor", "switch"),
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
  circleSize: 30,
  backgroundColor: "background"
};

export default Comp;
