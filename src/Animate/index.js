import React, { Fragment, useState } from "react";
import {
  useSpring,
  animated,
  config as springConfig
} from "react-spring/native";
import { View } from "react-native";

import styled from "../styled";
import Visible from "../Visible";

const Box = animated(styled.View());

export default function Animate(props) {
  const {
    from = { opacity: 0, y: 100 },
    to = { opacity: 1, y: 0 },
    children,
    stayVisible = true,
    onVisible,
    delay,
    reset,
    reverse,
    config,
    style,
    as,
    ...rest
  } = props;

  const [visible, setVisible] = useState(false);

  const { opacity, x, y, z } = useSpring({
    from,
    to: !visible && onVisible ? from : to,
    config: springConfig[config] || config || springConfig.default,
    delay: delay || 0,
    reset: reset || false,
    reverse: reverse || false
  });

  const AnimatedComp = (
    <Box
      as={as}
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
          disabled={visible && stayVisible}
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
}
