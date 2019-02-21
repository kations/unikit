import React, { Component } from "react";

import styled from "styled-components/native";

import PropTypes from "prop-types";

import { getProp, getColorSchema } from "../../helper";

// import styles from "./styles.css";

const Button = styled.TouchableOpacity`
  display: inline-block;
  padding: 15px 20px;
  width: auto;
  background-color: ${p =>
    getColorSchema(
      p,
      getProp(p, p.mode, "colors"),
      p.light ? "light" : "background"
    ).background};
  border-radius: ${p => getProp(p, "borderRadius", "button")}px;
  opacity: ${p => (p.disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text`
  color: ${p =>
    getColorSchema(
      p,
      getProp(p, p.mode, "button"),
      p.light ? "light" : "background"
    ).text};
`;

const Comp = ({ children, mode, style, disabled, onPress, light }) => {
  return (
    <Button
      style={style}
      mode={mode}
      disabled={disabled}
      light={light}
      onPress={disabled ? null : onPress || null}
      onMouseEnter={() => console.log("hover")}
      activeOpacity={0.6}
    >
      <ButtonText mode={mode} light={light}>
        {children}
      </ButtonText>
    </Button>
  );
};

Comp.propTypes = {
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node.isRequired
};

export default Comp;
