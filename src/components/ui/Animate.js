import React, { Fragment, useState } from "react";
import {
  useSpring,
  animated,
  config as springConfig
} from "react-spring/native";
import { View } from "react-native";
import Visible from "../helper/Visible";

import styled from "../../style/styled";

const Box = styled.View();
const AnimatedBox = animated(Box);

const Comp = props => {
  const {
    from,
    to,
    children,
    stayVisible,
    onVisible,
    delay,
    reset,
    reverse,
    config,
    style,
    as
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
    <AnimatedBox
      as={as}
      style={{
        ...style,
        opacity: opacity,
        transform: [{ translateY: y || 0 }, { translateX: x || 0 }]
      }}
    >
      {children}
    </AnimatedBox>
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
};

Comp.defaultProps = {
  stayVisible: true,
  from: { opacity: 0, y: 100 },
  to: { opacity: 1, y: 0 }
};

export default Comp;
