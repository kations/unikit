import React from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import PropTypes from "prop-types";

import { getProp } from "../../helper";
import { useTheme } from "../../style/Theme";

import Box from "../primitives/Box";
import Text from "../primitives/Text";
import Gradient from "./Gradient";
import Progress from "./Progress";

const Comp = props => {
  const {
    children,
    style,
    onPress,
    inline,
    activeOpacity,
    disabled,
    light,
    colors,
    color,
    loading,
    ...rest
  } = props;

  const theme = useTheme();
  const { button, text } = defaultStyle(props, theme);

  return (
    <Box
      as={TouchableOpacity}
      style={StyleSheet.flatten([button, style])}
      onPress={disabled ? null : onPress || null}
      onMouseEnter={() => console.log("hover")}
      activeOpacity={getProp(props, theme, "activeOpacity", "button")}
      comp="button"
      {...rest}
    >
      {/* <Gradient
        borderRadius={props.borderRadius}
        opacity={props.disabled ? 0.25 : 1}
      /> */}
      {loading ? (
        <Progress
          size={20}
          trackWidth={2}
          circleWidth={2}
          trackColor="transparent"
          circleColor={getProp(
            props,
            theme,
            props.invert ? "backgroundColor" : "color",
            "button",
            props.invert ? undefined : "backgroundColor"
          )}
          loading
        />
      ) : (
        <Text style={text}>{children}</Text>
      )}
    </Box>
  );
};

const isNum = number => {
  return typeof number === "number";
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    button: {
      display: Platform.OS === "web" ? "inline-flex" : "flex",
      paddingHorizontal: getProp(props, theme, "size", "button") / 2,
      height: getProp(props, theme, "size", "button"),
      width: "auto",
      backgroundColor: props.outline
        ? "transparent"
        : getProp(
            props.invert
              ? Object.assign({}, props, {
                  backgroundColorLighten: isNum(props.invert)
                    ? props.invert
                    : theme.button.invert
                })
              : props,
            theme,
            "backgroundColor",
            "button"
          ),
      opacity: props.disabled && !props.loading ? 0.5 : 1,
      alignItems: "center",
      justifyContent: "center"
    },
    text: {
      color: getProp(
        props,
        theme,
        props.invert || props.outline ? "backgroundColor" : "color",
        "button",
        props.invert || props.outline ? undefined : "backgroundColor"
      ),
      fontSize: getProp(props, theme, "size", "button") / 3.25
    }
  });

Comp.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
  colors: PropTypes.array
};

Comp.defaultProps = {
  loading: false
};

export default Comp;
