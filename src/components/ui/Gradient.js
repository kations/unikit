import React, { Component } from "react";
import Svg, { Defs, Stop, Rect, LinearGradient } from "swgs";
import styled, { withTheme } from "styled-components";
import PropTypes from "prop-types";

import Box from "../primitives/Box";
import { getProp } from "../../helper";

const Gradient = styled(Box)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  overflow: hidden;
`;

const getID = () => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(2, 10);
};

const Comp = props => {
  const { children, style, ...rest } = props;
  var id = getID();
  const colors = getProp(props, "colors", "gradient");
  return (
    <Gradient style={style} {...rest}>
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            {colors && colors.length > 0
              ? colors.map((color, index) => (
                  <Stop
                    key={`color-${color}-${index}`}
                    offset={`${(index / (colors.length - 1)) * 100}%`}
                    style={{ stopColor: color, stopOpacity: "1" }}
                  />
                ))
              : null}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </Gradient>
  );
};

Comp.propTypes = {
  colors: PropTypes.array,
  style: PropTypes.object
};

export default withTheme(Comp);
