import React, { Component } from "react";
import Svg, { Defs, Stop, Rect, LinearGradient } from "swgs";
import styled from "styled-components";
import { View } from "react-native";
import PropTypes from "prop-types";

const Gradient = styled(View)`
  width: 100px;
  height: 100px;
`;

const Comp = () => {
  return (
    <Gradient>
      <Svg height="100" width="100">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="170" y2="0">
            <Stop offset="0" stopColor="rgb(255,255,0)" stopOpacity="0" />
            <Stop offset="1" stopColor="red" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#grad)" />
      </Svg>
    </Gradient>
  );
};

Comp.propTypes = {
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object
};

export default Comp;
