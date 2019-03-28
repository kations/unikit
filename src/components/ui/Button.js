import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native-web";
import PropTypes from "prop-types";

import { getProp } from "../../helper";
import { useTheme } from "../../style/Theme";

import Box from "../primitives/Box";
import Text from "../primitives/Text";
import Gradient from "./Gradient";
import Progress from "./Progress";

const Comp = props => {
  const {
    mode,
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
      disabled={disabled || loading}
      loading={loading}
      onPress={disabled ? null : onPress || null}
      onMouseEnter={() => console.log("hover")}
      activeOpacity={getProp(props, theme, "activeOpacity", "button")}
      inline={getProp(props, theme, "inline", "button")}
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
          circleColor="#FFF"
          loading
        />
      ) : (
        <Text style={text}>{children}</Text>
      )}
    </Box>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    button: {
      display: "inline-flex",
      padding: getProp(props, theme, "size", "button") / 2,
      height: getProp(props, theme, "size", "button"),
      width: "auto",
      backgroundColor: getProp(props, theme, "backgroundColor", "button"),
      opacity: props.disabled && !props.loading ? 0.5 : 1,
      alignItems: "center",
      justifyContent: "center"
    },
    text: {
      position: "relative",
      zIndex: 10,
      color: getProp(props, theme, "color", "button", "backgroundColor"),
      fontSize: getProp(props, theme, "size", "button") / 3.25
    }
  });

Comp.propTypes = {
  mode: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
  colors: PropTypes.array
};

Comp.defaultProps = {
  loading: false,
  borderRadius: 22
};

export default Comp;
