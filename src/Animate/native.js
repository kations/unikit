import React, { Fragment, useState } from "react";
import {
  useSpring,
  animated,
  config as springConfig
} from "react-spring/native";
import { View } from "react-native";
import PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";
import Visible from "../Visible";

const Box = animated(styled.View());

const Animate = withThemeProps(
  ({
    from = { opacity: 0, y: 100, x: 0 },
    to = { opacity: 1, y: 0, x: 0 },
    children,
    stayVisible = true,
    onVisible,
    isVisible = true,
    delay,
    duration,
    config,
    style,
    ...rest
  }) => {
    const [visible, setVisible] = useState(onVisible ? false : isVisible);

    const { opacity, x, y, z } = useSpring({
      from,
      to: (!visible && onVisible) || isVisible === false ? from : to,
      config: springConfig[config] || config || springConfig.default,
      delay: delay || 0
    });

    const AnimatedComp = (
      <Box
        style={{
          ...style,
          opacity: opacity,
          transform: [{ translateY: y || 0 }, { translateX: x || 0 }]
        }}
        {...rest}
      >
        {children}
      </Box>
    );

    if (onVisible) {
      return (
        <Fragment>
          <Visible
            stayVisible={stayVisible}
            onChange={isVisible => {
              setVisible(isVisible);
            }}
            offset={100}
          >
            {({ isVisible }) => {
              return <View />;
            }}
          </Visible>
          {AnimatedComp}
        </Fragment>
      );
    }

    return AnimatedComp;
  },
  "Animate"
);

Animate.propTypes = {
  children: PropTypes.node,
  from: PropTypes.object,
  to: PropTypes.object,
  stayVisible: PropTypes.bool,
  onVisible: PropTypes.bool,
  isVisible: PropTypes.bool,
  delay: PropTypes.number,
  duration: PropTypes.number,
  config: PropTypes.object,
  style: PropTypes.object
};

Animate.defaultProps = {
  from: { opacity: 0, y: 100, x: 0 },
  to: { opacity: 1, y: 0, x: 0 },
  stayVisible: true,
  isVisible: true
};

export default Animate;
