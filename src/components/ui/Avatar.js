import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";

import PropTypes from "prop-types";

import { getProp, getColorSchema } from "../../helper";

// import styles from "./styles.css";
import Block from "../primitives/Block";
import Text from "../primitives/Text";
import Image from "../primitives/Image";

const Avatar = styled(Block)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: ${p => getProp(p, "size", "avatar")}px;
  width: ${p => getProp(p, "size", "avatar")}px;
  background-color: ${p =>
    getColorSchema(
      p,
      getProp(p, getProp(p, "mode", "avatar"), "colors"),
      p.light ? "light" : "background"
    ).background};
  border-radius: ${p => getProp(p, "size", "avatar") / 2}px;
`;

const Char = styled(Text)`
  position: relative;
  z-index: 10;
  font-size: ${p => getProp(p, "size", "avatar") / 2.25}px;
  font-weight: bold;
  color: ${p => getProp(p, "color", "avatar")};
`;

const Background = styled(Image)`
  left: 0;
  top: 0;
  height: ${p => getProp(p, "size", "avatar")}px;
  width: ${p => getProp(p, "size", "avatar")}px;
  z-index: 0;
  border-radius: ${p => getProp(p, "size", "avatar") / 2}px;
`;

const Comp = ({
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
}) => {
  return (
    <Avatar
      as={TouchableOpacity}
      style={style}
      light={light}
      mode={mode}
      size={size}
      onPress={onPress || null}
      onMouseEnter={() => console.log("hover")}
      activeOpacity={onPress ? 0.6 : 1}
      comp="avatar"
      {...rest}
    >
      {source ? (
        <Background
          source={source}
          width={size}
          height={size}
          resizeMode="cover"
          absolute
        />
      ) : null}
      {children ? (
        children
      ) : (
        <Char mode={mode} light={light} size={size} color={color}>
          {char}
        </Char>
      )}
    </Avatar>
  );
};

Comp.propTypes = {
  mode: PropTypes.string,
  char: PropTypes.string,
  size: PropTypes.number,
  source: PropTypes.object,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node.isRequired
};

export default Comp;
