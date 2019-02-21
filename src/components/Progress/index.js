import React, { Component } from "react";
import { ART } from "react-native";
const {
  Surface,
  Shape,
  Group,
  Text,
  Path,
  ClippingRectangle,
  LinearGradient,
  RadialGradient,
  Pattern,
  Transform
} = ART;

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

const radius = 175;
const diameter = Math.round(Math.PI * radius * 2);
const getOffset = (val = 0) => Math.round(((100 - val) / 100) * diameter);

const Comp = ({
  progress,
  size,
  lineWidth,
  animationDuration,
  loadingDuration,
  roundedStroke,
  responsive,
  onAnimationEnd,
  style
}) => {
  const strokeDashoffset = getOffset(0 || 0);
  const strokeLinecap = roundedStroke ? "round" : "butt";
  const svgSize = responsive ? "100%" : size;
  return (
    <Surface width={svgSize} height={svgSize}>
      <Shape fill={"red"} d={"M4 4V0h2v4h4v2H6v4H4V6H0V4h4z"} />
    </Surface>
  );
};

Comp.defaultProps = {
  animate: true,
  animationDuration: "1s",
  loadingDuration: "3s",
  showPercentage: true,
  showPercentageSymbol: true,
  size: 100,
  lineWidth: 30,
  percentSpacing: 10,
  roundedStroke: true
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
