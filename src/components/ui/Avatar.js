import React, { Component } from "react";
import { TouchableOpacity, StyleSheet } from "react-native-web";
import PropTypes from "prop-types";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";

import Box from "../primitives/Box";
import Text from "../primitives/Text";
import Image from "../primitives/Image";

const Comp = props => {
  const {
    children,
    mode,
    char,
    size,
    onPress,
    light,
    style,
    source,
    color,
    ...rest
  } = props;
  const theme = useTheme();
  const { avatar, background, text } = defaultStyle(props, theme);
  return (
    <Box
      as={TouchableOpacity}
      style={StyleSheet.flatten([avatar, style])}
      onPress={onPress || null}
      onMouseEnter={() => console.log("hover")}
      activeOpacity={onPress ? 0.6 : 1}
      comp="avatar"
      {...rest}
    >
      {source ? (
        <Image style={background} source={source} resizeMode="cover" />
      ) : null}
      {children ? children : <Text style={text}>{char}</Text>}
    </Box>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    avatar: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      height: getProp(props, theme, "size", "avatar"),
      width: getProp(props, theme, "size", "avatar"),
      backgroundColor: getProp(props, theme, "backgroundColor", "avatar"),
      borderRadius: getProp(props, theme, "size", "avatar") / 2
    },
    background: {
      position: "absolute",
      left: 0,
      top: 0,
      height: getProp(props, theme, "size", "avatar"),
      width: getProp(props, theme, "size", "avatar"),
      zIndex: 0,
      borderRadius: getProp(props, theme, "size", "avatar") / 2
    },
    text: {
      position: "relative",
      zIndex: 10,
      fontSize: getProp(props, theme, "size", "avatar") / 2.25,
      fontWeight: "bold",
      color: getProp(props, theme, "color", "avatar", "backgroundColor")
    }
  });

Comp.propTypes = {
  mode: PropTypes.string,
  char: PropTypes.string,
  size: PropTypes.number,
  source: PropTypes.object,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node
};

export default Comp;
